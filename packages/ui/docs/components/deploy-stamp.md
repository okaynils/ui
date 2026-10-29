---
title: DeployStamp
description: A footer line saying what's deployed and how long ago; the age keeps counting, and a deploy in progress pulses.
group: Gimmicks
order: 240
---

# DeployStamp

One line for a footer or a status bar that says what's running: "Deployed 14 min ago from `a1b2c3d` on main". The age keeps counting on its own, so a page left open still tells the truth. While a deploy is running, a pulsing dot says so, and a failed deploy says that plainly. It's an honest "this site is alive" signal for a startup's status page and a personal site's footer alike. Your app supplies the deploy data from your CI or hosting provider.

```tsx
import { DeployStamp } from "@nils/ui";
import type { DeployStampProps, DeployState } from "@nils/ui";
```

## Examples

### A site footer

```tsx live
<DeployStamp
  deployedAt={Date.now() - 14 * 60_000}
  commit="a1b2c3d4e5f6a7b8c9d0"
  commitHref="https://example.com/commit/a1b2c3d"
  branch="main"
/>
```

### States

`deploying` pulses until your app reports the result; `deployedAt` is then when the deploy started. `failed` uses the error tone and keeps the age so readers can see how stale the failure is.

```tsx live
<div className="flex flex-col items-start gap-3">
  <DeployStamp state="deploying" deployedAt={Date.now() - 2 * 60_000} commit="9f8e7d6" branch="main" environment="production" />
  <DeployStamp state="live" deployedAt={Date.now() - 3 * 3_600_000} commit="a1b2c3d" branch="main" environment="production" actor="nils" />
  <DeployStamp state="failed" deployedAt={Date.now() - 5 * 60_000} commit="4c5d6e7" branch="feat/billing" />
</div>
```

### Following a deploy

In a real app, switch `state` when your CI webhook or polling reports the result. Here a button stands in for it.

```tsx live
import { useState } from "react";
import { Button, DeployStamp } from "@nils/ui";
import type { DeployState } from "@nils/ui";

export default function Example() {
  const [deploy, setDeploy] = useState<{ state: DeployState; at: number; commit: string }>({
    state: "live",
    at: Date.now() - 40 * 60_000,
    commit: "a1b2c3d",
  });
  return (
    <div className="flex flex-col items-start gap-3">
      <DeployStamp state={deploy.state} deployedAt={deploy.at} commit={deploy.commit} branch="main" />
      <div className="flex gap-2">
        <Button size="sm" disabled={deploy.state === "deploying"} onClick={() => setDeploy({ state: "deploying", at: Date.now(), commit: "b2c3d4e" })}>Deploy</Button>
        <Button size="sm" variant="ghost" disabled={deploy.state !== "deploying"} onClick={() => setDeploy((d) => ({ ...d, state: "live", at: Date.now() }))}>Finish</Button>
      </div>
    </div>
  );
}
```

## Rules

- **Do** pass the real time from your CI or host. For `deploying`, pass when it started; for `live` and `failed`, when it finished.
- **Do** switch to `failed` when a deploy fails, even if the previous version is still serving. Say what happened; the age shows how long it's been broken.
- **Do** link the commit with `commitHref` when there's somewhere useful to go.
- **Don't** leave `state="deploying"` set from a stale snapshot. The pulse claims something is happening right now.
- **Don't** put more than one on a page. It's a footer line, not a deploy log; use `Timeline` for history.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `deployedAt` | `Date \| string \| number` | Required | When the deploy finished, or started while `deploying`. Invalid values print "at an unknown time". |
| `commit` | `string` | — | Commit SHA, shown as its first 7 characters in mono. |
| `commitHref` | `string` | — | Makes the commit a quiet `Link`. |
| `branch` | `string` | — | Branch, shown in mono after "on". |
| `environment` | `string` | — | Target, shown after "to". |
| `actor` | `string` | — | Who deployed, shown after "by". |
| `state` | `"live" \| "deploying" \| "failed"` | `"live"` | Dot tone and wording: ok, pulsing accent, err. |
| `locale` | `string` | `"en-GB"` | Locale for relative and absolute times. |
| `timeZone` | `string` | `"UTC"` | Zone for the absolute time shown before mount and in the tooltip. |
| `className` | `string` | — | Layout classes. |
| `...props` | `ComponentProps<"p">` | — | Standard attributes, including `ref`. |

## Motion

Ageing is the stamp's signature move. After mount, the relative time updates on each whole minute since the deploy, so "14 min ago" becomes "15 min ago" exactly on time. It counts hours after an hour and days after two days, and catches up immediately when a background tab becomes visible again. Before mount it shows the absolute time, so server and browser output match. While `deploying`, the dot breathes slowly (2.4s); it's the only motion, and it stops the moment the state changes. Under `prefers-reduced-motion` the dot is still.

## Accessibility

The line is a paragraph of plain text, so the state is always a word ("Deploying…", "Deploy failed", "Deployed"); the dot is decorative. The time is a `<time>` element with the full ISO instant, and hovering it shows the absolute date and time. Updates aren't announced; announce deploy results the way your app does for other events, e.g. with a toast.
