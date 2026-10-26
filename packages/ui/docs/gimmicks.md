---
title: About gimmicks
description: Optional widgets for personal sites, niche tools and small bits of useful personality.
group: Gimmicks
order: 0
---

# Gimmicks

Small widgets for things a general-purpose interface rarely needs: what you are listening to, the time where you live, a webring, a guestbook, or a tiny map. Use the ones that serve your screen. They share the core library's tokens, flat surfaces, rounded corners and keyboard access.

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
| [NowPlaying](/components/now-playing) | Listening activity and supplied playback progress. |
| [LocalTime](/components/local-time) | A place's clock, working hours and time difference. |
| [Availability](/components/availability) | Personal availability with optional contact details. |
| [ActivityCalendar](/components/activity-calendar) | Daily contributions, habits or activity. |
| [CurrentlyReading](/components/currently-reading) | A book, reading progress and a personal note. |
| [WeatherBadge](/components/weather-badge) | A compact local weather report. |
| [LinkPreview](/components/link-preview) | Annotated bookmarks and shared links. |
| [Webring](/components/webring) | Navigation through a community of sites. |
| [UptimeStrip](/components/uptime-strip) | Daily service health and incidents. |
| [ReleaseBadge](/components/release-badge) | A version and its release notes. |
| [Countdown](/components/countdown) | Time until an event, with a finished state. |
| [FocusTimer](/components/focus-timer) | Focus sessions and breaks. |
| [Waveform](/components/waveform) | Audio amplitude, elapsed time and seeking. |
| [KeystrokeDisplay](/components/keystroke-display) | Keyboard demonstrations and shortcut practice. |
| [BeforeAfter](/components/before-after) | Image comparisons with a movable divider. |
| [Guestbook](/components/guestbook) | A message form and list of supplied entries. |
| [VisitorCounter](/components/visitor-counter) | An old-web visitor counter with an app-supplied count. |
| [MiniMap](/components/mini-map) | A location marker on a small map. |

## Rules

- **Do** supply service data through props. Spotify, weather, counters and metadata fetching belong to your app.
- **Do** connect guestbook submissions to your own storage and moderation. Demo entries are local examples.
- **Do** show unavailable or stale data honestly. A widget's presence does not mean a service is connected.
- **Do** use one clear purpose per widget. A footer can show a clock without becoming a dashboard.
- **Don't** use continuous decorative motion to make a quiet widget compete for attention.

## Props

Each widget has its own component page with imports, runnable examples and a props table. All named components and their types are exported from `@nils/ui`.

## Accessibility

Statuses include words, changing clocks avoid constant announcements, and interactive widgets support keyboard operation. Keep essential information visible rather than hiding it only on hover. See each component's accessibility section for its exact interaction model.
