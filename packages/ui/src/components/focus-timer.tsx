import * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";
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
  /**
   * Mirror the remaining time into the tab title while running, e.g.
   * "12:34 Focus · My app". The original title comes back on pause,
   * completion and unmount.
   */
  titleCountdown?: boolean;
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

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** A local focus/break timer on a kitchen-timer dial. Every next phase begins with a deliberate action. */
export function FocusTimer({
  focusSeconds = 25 * 60,
  breakSeconds = 5 * 60,
  defaultPhase = "focus",
  label = "Time to focus",
  onComplete,
  titleCountdown = false,
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

  useTitleCountdown(titleCountdown && running, `${display} ${phaseLabel}`);

  return (
    <div role="group" aria-label="Focus timer" {...props} data-state={state.toLowerCase()} className={cn("inline-flex max-w-full flex-wrap items-center gap-x-5 gap-y-3", className)}>
      <Dial session={session} running={running} phaseLabel={phaseLabel} display={display} />
      <div className="flex min-w-0 flex-col items-start gap-2">
        <Status tone={session.completed ? "ok" : "neutral"} className="text-xs">{state}</Status>
        {label ? <p className="text-ui text-ink">{label}</p> : null}
        <div className="mt-1 flex flex-wrap gap-2">
          {session.completed ? (
            <Button size="sm" onClick={nextPhase}>Start {session.phase === "focus" ? "break" : "focus"}</Button>
          ) : running ? (
            <Button size="sm" onClick={pause}>Pause</Button>
          ) : (
            <Button size="sm" onClick={start}>{session.started ? "Resume" : "Start"}</Button>
          )}
          <Button size="sm" variant="ghost" onClick={reset}>Reset</Button>
        </div>
      </div>
      <span role="status" className="sr-only">{message}</span>
    </div>
  );
}

/** Writes `text` into the tab title while `active`, and puts the original back afterwards. */
function useTitleCountdown(active: boolean, text: string) {
  const original = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!active) return;
    if (original.current === null) original.current = document.title;
    document.title = original.current ? `${text} · ${original.current}` : text;
  }, [active, text]);
  React.useEffect(() => {
    if (active) return;
    if (original.current !== null) document.title = original.current;
    original.current = null;
  }, [active]);
  React.useEffect(() => () => {
    if (original.current !== null) document.title = original.current;
  }, []);
}

// Geometry in a 100×100 viewBox. The ring is a kitchen timer's face: twelve
// ticks, and an arc for the time that's left, ending at twelve o'clock.
const R = 44;
const TICKS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  return { x1: 50 + Math.sin(angle) * 48, y1: 50 - Math.cos(angle) * 48, x2: 50 + Math.sin(angle) * (i % 3 === 0 ? 45 : 46.5), y2: 50 - Math.cos(angle) * (i % 3 === 0 ? 45 : 46.5) };
});

function arcFor(fraction: number) {
  const left = Math.min(1, Math.max(0, fraction));
  const angle = (1 - left) * Math.PI * 2;
  return {
    // pathLength=1: the dash is the remaining fraction, shifted so the gap
    // (time already spent) sits behind the hand, clockwise from twelve.
    dash: `${left} 1`,
    offset: `${-(1 - left)}`,
    hand: { cx: 50 + Math.sin(angle) * R, cy: 50 - Math.cos(angle) * R },
  };
}

/**
 * The dial. While the timer runs, the arc drains every frame from the wall
 * clock, so the hand sweeps instead of ticking. Paused, complete or under
 * reduced motion, it's drawn from the per-second state and holds still.
 */
function Dial({ session, running, phaseLabel, display }: { session: Session; running: boolean; phaseLabel: string; display: string }) {
  const arc = React.useRef<SVGCircleElement>(null);
  const hand = React.useRef<SVGCircleElement>(null);
  const shownMs = Math.ceil(session.remainingMs / 1000) * 1000;
  const still = arcFor(session.completed ? 0 : Math.min(session.durationMs, shownMs) / session.durationMs);

  React.useEffect(() => {
    if (!running || session.deadline === null || prefersReducedMotion()) return;
    const deadline = session.deadline;
    let frame = 0;
    const draw = () => {
      const next = arcFor(Math.max(0, deadline - Date.now()) / session.durationMs);
      arc.current?.setAttribute("stroke-dasharray", next.dash);
      arc.current?.setAttribute("stroke-dashoffset", next.offset);
      hand.current?.setAttribute("cx", String(next.hand.cx));
      hand.current?.setAttribute("cy", String(next.hand.cy));
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [running, session.deadline, session.durationMs]);

  const long = display.length > 5;
  return (
    <div className="relative size-32 shrink-0">
      <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 size-full">
        {TICKS.map((tick, i) => <line key={i} {...tick} stroke="var(--ui-ink-3)" strokeWidth={i % 3 === 0 ? 1.25 : 0.75} strokeLinecap="round" />)}
        <circle cx="50" cy="50" r={R} fill="none" stroke="var(--ui-line-strong)" strokeWidth="1" />
        <circle
          ref={arc}
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke={session.phase === "focus" ? "var(--ui-ink)" : "var(--ui-ink-2)"}
          strokeWidth="3"
          pathLength={1}
          strokeDasharray={still.dash}
          strokeDashoffset={still.offset}
          transform="rotate(-90 50 50)"
          strokeLinecap="butt"
        />
        {session.completed ? null : <circle ref={hand} cx={still.hand.cx} cy={still.hand.cy} r="3" fill="var(--ui-surface)" stroke={session.phase === "focus" ? "var(--ui-ink)" : "var(--ui-ink-2)"} strokeWidth="1.5" />}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="ui-label">{phaseLabel}</span>
        <div
          role="timer"
          aria-live="off"
          aria-label={`${phaseLabel}: ${display} remaining`}
          className={cn("font-mono leading-8 font-medium text-ink tabular-nums", long ? "text-[19px]" : "text-[26px]")}
        >
          {display}
        </div>
      </div>
    </div>
  );
}
