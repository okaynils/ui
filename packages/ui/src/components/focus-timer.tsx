import * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { Progress } from "./progress";
import { Status } from "./status";

export type FocusTimerPhase = "focus" | "break";

export interface FocusTimerProps extends Omit<React.ComponentProps<"div">, "children" | "onComplete"> {
  /** Focus period in seconds. Defaults to 25 minutes. */
  focusSeconds?: number;
  /** Break period in seconds. Defaults to 5 minutes. */
  breakSeconds?: number;
  /** Initial phase, read once on mount. */
  defaultPhase?: FocusTimerPhase;
  /** A short purpose, such as “Write the first draft”. */
  label?: string;
  /** Fires once when a started phase reaches zero. The next phase waits for user input. */
  onComplete?: (phase: FocusTimerPhase) => void;
}

interface Session {
  phase: FocusTimerPhase;
  durationMs: number;
  remainingMs: number;
  deadline: number | null;
  started: boolean;
  completed: boolean;
}

function seconds(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? Math.min(86_400, Math.max(1, Math.round(value))) : fallback;
}

function sessionFor(phase: FocusTimerPhase, duration: number): Session {
  return { phase, durationMs: duration * 1000, remainingMs: duration * 1000, deadline: null, started: false, completed: false };
}

function clock(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor(total % 3600 / 60);
  const s = String(total % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${String(m).padStart(2, "0")}:${s}`;
}

/** A local focus/break timer. Every next phase begins with a deliberate action. */
export function FocusTimer({
  focusSeconds = 25 * 60,
  breakSeconds = 5 * 60,
  defaultPhase = "focus",
  label = "Time to focus",
  onComplete,
  className,
  ...props
}: FocusTimerProps) {
  const durations = { focus: seconds(focusSeconds, 25 * 60), break: seconds(breakSeconds, 5 * 60) };
  const [session, setSession] = React.useState(() => sessionFor(defaultPhase, durations[defaultPhase]));
  const current = React.useRef(session);
  const callback = React.useRef(onComplete);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => { callback.current = onComplete; }, [onComplete]);

  function publish(next: Session) {
    // Event handlers and timer callbacks share the latest snapshot, including
    // before React commits, so a delayed tick cannot complete a phase twice.
    current.current = next;
    setSession(next);
  }

  function update() {
    const previous = current.current;
    if (previous.deadline === null) return;
    const remainingMs = Math.max(0, previous.deadline - Date.now());
    if (remainingMs === 0) {
      publish({ ...previous, remainingMs: 0, deadline: null, completed: true });
      setMessage(previous.phase === "focus" ? "Focus complete. Start a break when you are ready." : "Break complete. Start a focus session when you are ready.");
      callback.current?.(previous.phase);
    } else {
      publish({ ...previous, remainingMs });
    }
  }

  React.useEffect(() => {
    if (session.deadline === null) return;
    // Elapsed time comes from the wall clock; throttled background ticks never
    // make the session longer or silently start additional phases.
    update();
    const interval = setInterval(update, 250);
    const wake = () => { if (!document.hidden) update(); };
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("focus", wake);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("focus", wake);
    };
  }, [session.deadline]);

  function start() {
    const previous = current.current;
    if (previous.deadline !== null || previous.completed) return;
    publish({ ...previous, deadline: Date.now() + previous.remainingMs, started: true });
    setMessage(`${previous.phase === "focus" ? "Focus" : "Break"} ${previous.started ? "resumed" : "started"}.`);
  }

  function pause() {
    update();
    const previous = current.current;
    if (previous.completed || previous.deadline === null) return;
    publish({ ...previous, deadline: null });
    setMessage(`${previous.phase === "focus" ? "Focus" : "Break"} paused.`);
  }

  function reset() {
    const phase = current.current.phase;
    publish(sessionFor(phase, durations[phase]));
    setMessage(`${phase === "focus" ? "Focus" : "Break"} reset. Ready to start.`);
  }

  function nextPhase() {
    const phase = current.current.phase === "focus" ? "break" : "focus";
    const next = sessionFor(phase, durations[phase]);
    publish({ ...next, deadline: Date.now() + next.remainingMs, started: true });
    setMessage(`${phase === "focus" ? "Focus" : "Break"} started.`);
  }

  const running = session.deadline !== null;
  const state = session.completed ? "Complete" : running ? "Running" : session.started ? "Paused" : "Ready";
  const phaseLabel = session.phase === "focus" ? "Focus" : "Break";
  const display = clock(session.remainingMs);

  return (
    <div role="group" aria-label="Focus timer" {...props} className={cn("w-full max-w-xs space-y-3 rounded-box border border-line-strong bg-surface p-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="ui-label">{phaseLabel}</span>
        <Status tone={session.completed ? "ok" : "neutral"} className="text-xs">{state}</Status>
      </div>
      <div>
        <div role="timer" aria-live="off" aria-label={`${phaseLabel}: ${display} remaining`} className="font-mono text-[26px] leading-8 font-medium text-ink tabular-nums">{display}</div>
        {label ? <p className="mt-1 text-ui text-ink-2">{label}</p> : null}
      </div>
      <Progress value={session.durationMs - session.remainingMs} max={session.durationMs} aria-label={`${phaseLabel} session progress`} aria-valuetext={`${display} remaining`} />
      <div className="flex flex-wrap gap-2">
        {session.completed ? (
          <Button size="sm" onClick={nextPhase}>Start {session.phase === "focus" ? "break" : "focus"}</Button>
        ) : running ? (
          <Button size="sm" onClick={pause}>Pause</Button>
        ) : (
          <Button size="sm" onClick={start}>{session.started ? "Resume" : "Start"}</Button>
        )}
        <Button size="sm" variant="ghost" onClick={reset}>Reset</Button>
      </div>
      <span role="status" className="sr-only">{message}</span>
    </div>
  );
}
