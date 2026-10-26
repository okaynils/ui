---
title: Avatar
description: A rounded square picture of a person or org in four sizes, with mono initials as the fallback, and an overlapping AvatarGroup.
group: Feedback
order: 30
---

# Avatar

A rounded square picture of a person or an organisation. While the image loads, or if it fails, mono initials show on a grey square with 4px corners. `AvatarGroup` overlaps several, each cut out of the next by a ring in the page colour.

```tsx
import { Avatar, AvatarGroup } from "@nils/ui";
```

## Examples

### Sizes

`24` is the default and fits inside a row or beside `text-ui`.

```tsx live
<div className="flex items-center gap-3">
  <Avatar name="Ada Lovelace" size={20} />
  <Avatar name="Ada Lovelace" size={24} />
  <Avatar name="Ada Lovelace" size={32} />
  <Avatar name="Ada Lovelace" size={40} />
</div>
```

### Image and fallback

The image fades in when it's loaded. A broken URL falls back to initials.

```tsx live
<div className="flex items-center gap-3">
  <Avatar name="okaynils" src="https://github.com/okaynils.png" size={32} />
  <Avatar name="Grace Hopper" src="https://example.invalid/missing.png" size={32} />
  <Avatar name="Linus" size={32} />
</div>
```

### Group

`max` caps how many show; the rest become a `+N` chip. The group sets every avatar's `size`.

```tsx live
<AvatarGroup max={4} size={24}>
  <Avatar name="Ada Lovelace" />
  <Avatar name="Grace Hopper" />
  <Avatar name="Alan Turing" />
  <Avatar name="Edsger Dijkstra" />
  <Avatar name="Barbara Liskov" />
  <Avatar name="Ken Thompson" />
</AvatarGroup>
```

### Beside a name

```tsx live
<div className="flex items-center gap-2 text-ui">
  <Avatar name="Ada Lovelace" />
  <span className="font-medium text-ink">Ada Lovelace</span>
  <span className="text-ink-3">deployed 2m ago</span>
</div>
```

## Rules

- **Do** keep the rounded square shape (`rounded-ui`, 4px), including the group’s `+N` chip.
- **Do** always pass `name`. It's the alt text and the source of the initials.
- **Do** use `24` in rows and `32`–`40` in headers and profile cards.
- **Don't** add status rings, borders or coloured backgrounds. Put a `Status` beside it instead.
- **Don't** use avatars as decoration where the name alone would do.

## Props

### Avatar

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Required. Alt text and initials ("Ada Lovelace" → "AL"). |
| `src` | `string` | — | Image URL. Initials show while loading (after 300ms) or on error. |
| `size` | `20 \| 24 \| 32 \| 40` | `24` | Side length in px. |
| `className` | `string` | — | Layout only. |

### AvatarGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `max` | `number` | — | Show at most this many; the rest become `+N`. |
| `size` | `20 \| 24 \| 32 \| 40` | `24` | Applied to every avatar and the `+N` chip. |
| `...props` | `ComponentProps<"div">` | — | Passed to the wrapper. |

## Accessibility

- The image's `alt` is `name`. Without an image, the initials carry `role="img"` and `aria-label={name}`.
- The `+N` chip is labelled "N more".
