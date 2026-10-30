---
title: About gimmicks
description: Optional widgets for personal sites, niche tools and small bits of useful personality.
group: Gimmicks
order: 0
---

# Gimmicks

Small widgets for things a general-purpose interface rarely needs: what you are listening to, the time where you live, a webring, a guestbook, or a tiny map. They're allowed to play: each one looks like the thing it imitates and has one signature move that shows real state, like an odometer's wheels rolling or a webring shuffling before it lands. Underneath they share the core library's tokens, corners and keyboard access.

```tsx
import { Availability, LocalTime, NowPlaying } from "@nils/ui";
```

## Examples

### A personal-site footer

```tsx live
<div className="flex flex-col items-start gap-3">
  <LocalTime timeZone="Europe/Stockholm" label="Stockholm" />
  <Availability state="open" label="Open for small projects" />
</div>
```

## Widgets

| Component | Use it for |
| --- | --- |
| [NowPlaying](/components/now-playing) | Listening activity, with equaliser bars while something plays. |
| [LocalTime](/components/local-time) | A place's clock, working hours and time difference. |
| [Availability](/components/availability) | Personal availability with optional contact details. |
| [ActivityCalendar](/components/activity-calendar) | Daily activity and streaks. |
| [CurrentlyReading](/components/currently-reading) | The book you're reading and your page. |
| [WeatherBadge](/components/weather-badge) | Local weather with the daylight left. |
| [Webring](/components/webring) | A ring of sites, with a shuffling Random. |
| [UptimeStrip](/components/uptime-strip) | Daily service health and incidents. |
| [Countdown](/components/countdown) | Departure-board time until an event. |
| [FocusTimer](/components/focus-timer) | Focus sessions and breaks on a dial. |
| [Waveform](/components/waveform) | Audio amplitude, elapsed time and seeking. |
| [KeystrokeDisplay](/components/keystroke-display) | Keyboard demos and shortcut practice. |
| [BeforeAfter](/components/before-after) | Image comparisons with a movable divider. |
| [Guestbook](/components/guestbook) | An old-web ledger visitors sign. |
| [VisitorCounter](/components/visitor-counter) | An old-web odometer for an app-supplied count. |
| [MiniMap](/components/mini-map) | A place on a small map, with coordinates. |
| [Receipt](/components/receipt) | Order confirmations and itemised summaries, printed. |
| [Ticket](/components/ticket) | Event tickets and invites with a tear-off stub. |
| [SplitFlap](/components/split-flap) | A departure-board word or code. |
| [Waitlist](/components/waitlist) | Launch sign-ups and your place in line. |
| [Stamp](/components/stamp) | Marking something done: paid, shipped, read. |
| [DeployStamp](/components/deploy-stamp) | Showing what's deployed and how long ago. |
| [StarButton](/components/star-button) | Public stars or follows with a live count. |
| [SeatsLeft](/components/seats-left) | Limited spots, seats or tickets, shown honestly. |
| [Kudos](/components/kudos) | Applause for a post or project. |
| [ScratchCard](/components/scratch-card) | Promo codes, launch dates and easter eggs to scratch off. |
| [FilmStrip](/components/film-strip) | Recently watched films and favourites, e.g. from Letterboxd. |

## Rules

- **Do** supply service data through props. Spotify, weather, counters and metadata fetching belong to your app.
- **Do** connect guestbook submissions to your own storage and moderation. Demo entries are local examples.
- **Do** show unavailable or stale data honestly. A widget's presence does not mean a service is connected.
- **Do** use one clear purpose per widget. A footer can show a clock without becoming a dashboard.
- **Do** let a gimmick be what it is. An odometer should look like an odometer, not a card with a number in it.
- **Don't** stack gimmicks' moving parts in one view. One equaliser or one countdown per screen; motion that runs only while its state is live, never just to draw the eye.

## Props

Each widget has its own component page with imports, runnable examples and a props table. All named components and their types are exported from `@nils/ui`.

## Accessibility

Statuses include words, changing clocks avoid constant announcements, and interactive widgets support keyboard operation. Keep essential information visible rather than hiding it only on hover. See each component's accessibility section for its exact interaction model.
