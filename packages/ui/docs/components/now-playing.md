---
title: NowPlaying
description: A listening badge with album artwork, track details, equaliser bars that move while playing, and a playhead that keeps time; as a card, a compact row, or inline in a sentence.
group: Gimmicks
order: 10
---

# NowPlaying

A small window into what someone is listening to: artwork, track, artist and playback state. While something plays, three equaliser bars bounce beside the word "Playing" and the progress bar keeps time on its own between your updates. Pause, and both settle. It works as a passive badge on a personal site, or with a playback button when your app owns the player. Your app supplies the data and any service integration; this component contains no Spotify login, fetching or audio playback.

```tsx
import { NowPlaying } from "@nils/ui";
import type { NowPlayingProps, NowPlayingTrack, NowPlayingState, NowPlayingVariant } from "@nils/ui";
```

## Examples

### A listening badge

Pass the position your service last reported. While `state` is `"playing"`, the playhead counts forward from it in real time, so polling a service every 30 seconds still gives a moving bar. A new `position` always replaces the counted one.

```tsx live
<NowPlaying
  track={{
    title: "1/1",
    artist: "Brian Eno",
    album: "Ambient 1: Music for Airports",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ee/71/42/ee71425d-6bc9-3df8-c90b-8539f59144ab/00724386649553.rgb.jpg/200x200bb.jpg",
    duration: 1041,
  }}
  position={312}
/>
```

### A controlled player

The controls below simulate a player without making requests. Press play and watch the bars and playhead start; pause and they hold where they are. In a real app, confirm playback with the player before updating `state`.

```tsx live
import { useState } from "react";
import { Button, NowPlaying } from "@nils/ui";

export default function Example() {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(32);
  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-3">
      <NowPlaying
        track={{
          title: "Computer Love",
          artist: "Kraftwerk",
          album: "Computer World",
          artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music1/v4/ac/34/2d/ac342dcf-8349-676f-9510-c1bd27e932d2/dj.ajlyslln.jpg/200x200bb.jpg",
          duration: 439,
        }}
        position={position}
        state={playing ? "playing" : "paused"}
        onPlaybackToggle={() => setPlaying((current) => !current)}
      />
      <Button size="sm" onClick={() => setPosition((current) => Math.min(439, current + 15))}>Advance 15 seconds</Button>
    </div>
  );
}
```

### A compact row

`variant="row"` fits it into one 32px line, the height of a default control, for lists, sidebars and dashboards: a small cover, title and artist, the equaliser and the elapsed time. Progress becomes a hairline along the bottom edge.

```tsx live
import { NowPlaying } from "@nils/ui";

const ENO = "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ee/71/42/ee71425d-6bc9-3df8-c90b-8539f59144ab/00724386649553.rgb.jpg/200x200bb.jpg";
const KRAFTWERK = "https://is1-ssl.mzstatic.com/image/thumb/Music1/v4/ac/34/2d/ac342dcf-8349-676f-9510-c1bd27e932d2/dj.ajlyslln.jpg/200x200bb.jpg";

export default function Example() {
  return (
    <div className="w-full max-w-md">
      <NowPlaying
        variant="row"
        track={{ title: "1/1", artist: "Brian Eno", artwork: ENO, duration: 1041 }}
        position={312}
      />
      <NowPlaying
        variant="row"
        state="paused"
        track={{ title: "Computer Love", artist: "Kraftwerk", artwork: KRAFTWERK, duration: 439 }}
        position={128}
      />
      <NowPlaying variant="row" track={null} />
    </div>
  );
}
```

### Inside a sentence

`variant="inline"` sits in running text and scales with it: a small cover, the equaliser, then "title by artist". Use it on a personal site's intro or an about page.

```tsx live
<p className="max-w-md text-sm leading-6 text-ink-2">
  Writing this page while listening to 
  <NowPlaying
    variant="inline"
    track={{ title: "1/1", artist: "Brian Eno", artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ee/71/42/ee71425d-6bc9-3df8-c90b-8539f59144ab/00724386649553.rgb.jpg/200x200bb.jpg" }}
  />
  . It's the only thing that works for long writing sessions.
</p>
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
- **Don't** infer that a person is still listening from stale data. The app should decide when a snapshot becomes offline; until it does, the playhead stops at the end of the track.
- **Don't** pass `state="playing"` for a snapshot you can't vouch for. The bars and moving playhead say "this is happening right now".
- **Don't** add a second moving element nearby. The equaliser is this badge's one moving part.
- **Do** use `row` in lists and dashboards, and `inline` only inside running text. Inline has no progress or controls; it states what's playing, nothing more.
- **Don't** stack several playing rows. One person listens to one thing; show history as plain rows with `state="paused"` or a `List`.

## Props

### NowPlaying

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `track` | `NowPlayingTrack \| null` | required | Current track, or null when nothing is playing. |
| `state` | `"playing" \| "paused" \| "offline"` | `"playing"` | Supplied playback or connection state. A null track displays "Nothing playing" unless offline. |
| `position` | `number` | — | Playback position in seconds, as last reported by the player. Clamped to the track. |
| `advance` | `boolean` | `true` | While playing, count the position forward from the last report using the wall clock. Set `false` if your app already pushes the position every second. |
| `loading` | `boolean` | `false` | Show artwork/text placeholders with a loading label. |
| `variant` | `"card" \| "row" \| "inline"` | `"card"` | `card` is the standalone badge; `row` is one 32px line for lists, with elapsed time and progress as a bottom hairline; `inline` is a `<span>` that sits in a sentence and scales with its font size. |
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

The equaliser is this badge's signature move. While `state` is `"playing"`, three 3px bars in the `ok` colour scale up and down at slightly different speeds (520–740ms each, alternating), so they never fall into step. Paused, they settle to short grey bars; offline or idle, they're replaced by a status dot. This is the only continuous motion in the badge, and it runs only while something is actually playing.

The playhead advances once a second from the wall clock, using the progress bar's normal transition. Under `prefers-reduced-motion` the bars stand still at their resting heights; the word "Playing" and the moving time still carry the state.

## Accessibility

- State is always a word ("Playing", "Paused", "Offline"). The equaliser and dot are decorative and hidden from assistive technology.
- Artwork is decorative because the adjacent text identifies the track; the fallback note is hidden from screen readers too.
- The progress bar exposes seconds and a readable elapsed/total value. It is not a live region and does not announce every update.
- Playback controls have "Pause playback" and "Resume playback" labels. Title links and controls support native keyboard interaction.
- Loading sets `aria-busy` on the root group.
