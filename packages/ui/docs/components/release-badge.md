---
title: ReleaseBadge
description: A compact version and release date, with optional release notes in a popover and a separate release-page link.
group: Gimmicks
order: 100
---

# ReleaseBadge

A small answer to “which version is this?” Use it in a project footer, app settings or a personal project list. Supply the version, date and notes from your app. The version stays a passive badge; the notes button opens a popover, and an optional release-page link navigates separately.

```tsx
import { ReleaseBadge } from "@nils/ui";
```

## Examples

### Version and date

The version is displayed as supplied. Include `v` if you want that prefix. Dates use UTC so a calendar release date doesn't move to the previous day in another time zone.

```tsx live
<ReleaseBadge version="v0.4.2" releasedAt="2026-10-20" />
```

### What's new

Click or tap the notes button, or focus it and press Enter or Space. Escape closes the popover. The notes are ordinary React content, so a short paragraph or list works without a markdown renderer.

```tsx live
<ReleaseBadge
  version="v0.5.0"
  releasedAt="2026-10-26"
  notes={
    <ul className="list-disc space-y-1 pl-4">
      <li>Added a compact activity calendar.</li>
      <li>Kept selected filters when returning to a list.</li>
      <li>Improved keyboard focus in the command menu.</li>
    </ul>
  }
/>
```

### A release page

The native link and notes button are separate targets. Following the link never opens a popup first.

```tsx live
<ReleaseBadge
  version="v1.2.0"
  releasedAt="2026-09-18T16:30:00Z"
  href="https://example.com/project/releases/1.2.0"
  notes="A smaller download, clearer errors and a new export option. The release page has the full change list."
/>
```

### Unknown release

A missing version shows an explicit unavailable state. Missing dates are omitted; invalid supplied dates say “Date unavailable”. Neither is guessed from the visitor's current clock.

```tsx live
<div className="flex flex-col items-start gap-3">
  <ReleaseBadge version={null} />
  <ReleaseBadge version="v0.3.1" />
  <ReleaseBadge version="v0.3.0" releasedAt="2026-02-30" />
</div>
```

## Rules

- **Do** supply release metadata from the consuming app. This widget does not check a repository, package registry or update service.
- **Do** keep notes short. Link to a full changelog with `href` when the release needs more detail.
- **Do** pass a date-only ISO string for a calendar release date, or an ISO instant containing `Z` or an explicit offset. All dates display in UTC.
- **Do** pass `version={null}` when release data is unavailable, rather than presenting a guessed version.
- **Don't** make the badge itself both a link and a popup trigger. The separate controls make their actions clear on keyboard and touch.
- **Don't** use status colours to decorate a release number. It is a version, not a health status.

## Props

Extends `<span>` attributes except `children`; standard attributes and `ref` apply to the outer wrapper.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `version` | `string \| null` | Required | Display version, including any desired prefix. Null, empty or whitespace-only values show “Release unavailable” and hide date, notes and link. |
| `releasedAt` | `Date \| string \| number` | — | Release date or instant. Numbers are Unix milliseconds. Omitted dates are hidden; invalid dates show “Date unavailable”. Date-only rollovers such as February 30 are rejected. |
| `notes` | `ReactNode` | — | Short notes shown in a titled popover. Empty notes omit the trigger. |
| `href` | `string` | — | Release page URL, rendered as a native “View release” link. |
| `locale` | `string` | `"en-GB"` | Date formatting locale. Invalid locales fall back to en-GB; the time zone is always UTC. |
| `className` | `string` | — | Layout classes on the outer wrapper. |
| `...props` | `ComponentProps<"span">` | — | Standard wrapper attributes, including `ref`. |

Exports `ReleaseBadge` and the `ReleaseBadgeProps` type.

## Motion

The notes popover enters in 150ms and exits in 100ms using the shared surface motion. The release metadata itself has no animation. Reduced motion follows the library settings.

## Accessibility

- The version is plain text in a badge. Dates use `<time>` with the full ISO instant in `dateTime`.
- The notes trigger is a real button named “Release notes for [version]”; it works with Enter, Space and touch.
- The popover has a title, supports Escape and restores focus to its trigger on dismissal.
- The release-page link remains a native anchor with its own descriptive accessible name. No controls are nested inside another interactive element.
