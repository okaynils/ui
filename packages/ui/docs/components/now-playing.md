---
title: NowPlaying
description: A compact listening badge with square album artwork, track details, playback state and supplied progress.
group: Gimmicks
order: 10
---

# NowPlaying

A small window into what someone is listening to: artwork, track, artist and playback state. It works as a passive badge on a personal site, or with a playback button when your app owns the player. Your app supplies the data and any service integration; this component contains no Spotify login, fetching or audio playback.

```tsx
import { NowPlaying } from "@nils/ui";
import type { NowPlayingProps, NowPlayingTrack, NowPlayingState } from "@nils/ui";
```

## Examples

### A listening badge

The progress is a supplied snapshot. Update `position` from your player or service to move it; the widget never assumes playback is advancing.

```tsx live
<NowPlaying
  track={{ title: "Night windows", artist: "Demo artist", album: "Small hours", duration: 242 }}
  position={83}
/>
```

### A controlled player

The controls below simulate a player without making requests. In a real app, confirm playback with the player before updating `state`.

```tsx live
import { useState } from "react";
import { Button, NowPlaying } from "@nils/ui";

export default function Example() {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(32);
  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-3">
      <NowPlaying
        track={{ title: "Soft signal", artist: "Demo artist", duration: 180 }}
        position={position}
        state={playing ? "playing" : "paused"}
        onPlaybackToggle={() => setPlaying((current) => !current)}
      />
      <Button size="sm" onClick={() => setPosition((current) => Math.min(180, current + 15))}>Advance 15 seconds</Button>
    </div>
  );
}
```

### Quiet, disconnected and loading

Use `track={null}` for nothing playing, and `state="offline"` when the data source is unavailable. Loading is a separate state, so a missing response never looks like confirmed silence.

```tsx live
<div className="flex w-full max-w-sm flex-col gap-3">
  <NowPlaying track={null} />
  <NowPlaying track={null} state="offline" />
  <NowPlaying track={null} loading />
</div>
```

## Rules

- **Do** supply service or player data from the consuming app. A music service is an adapter, not a dependency of this component.
- **Do** pass position and duration in seconds. Progress is hidden unless both are finite and duration is positive; position is clamped to the track.
- **Do** provide `track.artwork` for a cover image and `track.href` when the title should link to the track. Artwork stays square with 4px corners; missing or broken images use a music-note fallback.
- **Do** use `offline` for a disconnected or failed source and `track={null}` for a confirmed idle player.
- **Don't** show a playback control unless your app can carry out the action. Omit `onPlaybackToggle` for a passive badge.
- **Don't** infer that a person is still listening from stale data. The app should decide when a snapshot becomes offline.

## Props

### NowPlaying

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `track` | `NowPlayingTrack \| null` | required | Current track, or null when nothing is playing. |
| `state` | `"playing" \| "paused" \| "offline"` | `"playing"` | Supplied playback or connection state. A null track displays "Nothing playing" unless offline. |
| `position` | `number` | — | Current playback position in seconds. Progress remains static until the app updates it. |
| `loading` | `boolean` | `false` | Show artwork/text placeholders with a loading label. |
| `onPlaybackToggle` | `() => void` | — | Displays a pause/resume button and requests the action. Does not change state internally. Hidden when offline or without a track. |
| `className` | `string` | — | Layout classes; defaults to full width up to `max-w-sm`. |
| `...props` | `ComponentProps<"div">` | — | Root attributes and ref. The root defaults to a group named "Listening activity". |

### NowPlayingTrack

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | required | Track title. |
| `artist` | `string` | required | Artist or creator. |
| `album` | `string` | — | An optional third line beneath the artist. |
| `artwork` | `string` | — | Cover image URL; missing or failed images use a note icon. |
| `href` | `string` | — | Makes the title a native link to the track. |
| `duration` | `number` | — | Total seconds; a finite positive value enables progress when `position` is also supplied. |

## Motion

Supplied progress changes use the library's 200ms progress transition. Playback state changes immediately. No equalizer, automatic progress timer or continuous decorative animation runs. Reduced motion follows the library settings.

## Accessibility

- Status is a dot plus readable text. Colour is supplementary.
- Artwork is decorative because the adjacent text identifies the track; the fallback note is hidden from screen readers too.
- The progress bar exposes seconds and a readable elapsed/total value. It is not a live region and does not announce every update.
- Playback controls have "Pause playback" and "Resume playback" labels. Title links and controls support native keyboard interaction.
- Loading sets `aria-busy` on the root group.
