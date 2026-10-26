---
title: MiniMap
description: A small abstract map of supplied percentage positions, with one emphasised place, an optional link out and no mapping service.
group: Gimmicks
order: 180
---

# MiniMap

A quiet locator for a footer or contact block: a grid, a few marked places, one of them emphasised. Positions are percentages you supply, so there are no tiles, keys, geocoding or network requests. Link out to a real map when someone needs directions.

```tsx
import { MiniMap } from "@nils/ui";
```

## Examples

### A place and its neighbours

Give each marker a `label` — it is shown for the primary place, available on hover for the rest, and read aloud as a summary.

```tsx live
<MiniMap
  name="Södermalm, Stockholm"
  markers={[
    { id: "studio", x: 44, y: 52, label: "The studio", primary: true },
    { id: "coffee", x: 62, y: 38, label: "Coffee on Hornsgatan" },
    { id: "park", x: 26, y: 72, label: "The park" },
  ]}
  caption="Two minutes from the water."
/>
```

### A link to the real thing

`href` adds a link in the header. The frame keeps only the grid it draws itself; your link owns everything beyond that.

```tsx live
<MiniMap
  name="Workshop, Copenhagen"
  href="https://example.com/maps/workshop"
  markers={[
    { id: "door", x: 58, y: 44, label: "The entrance", primary: true },
    { id: "bike", x: 70, y: 66, label: "Bike parking" },
  ]}
  caption="Nørrebro · Wednesdays 10–16"
/>
```

### Without the grid

Drop the grid when the marker positions matter more than the sense of a map, or when the surrounding layout already has lines.

```tsx live
<MiniMap
  name="Region"
  grid={false}
  markers={[
    { id: "hq", x: 30, y: 40, label: "Headquarters", primary: true },
    { id: "depot", x: 74, y: 62, label: "Depot" },
  ]}
/>
```

## Rules

- **Do** treat `x`/`y` as a share of the frame, 0–100, not as coordinates. This map is a diagram, so place markers to read well.
- **Do** keep one `primary` marker. It carries the label and the accent dot; a second one splits attention.
- **Do** write marker labels as places, not addresses — “The studio”, “Bike parking”.
- **Do** give the map a `name` that matches the caption, and link out with `href` when directions matter.
- **Don't** embed a mapping provider or add a key. If you need real geography, render a map and use this only as a preview.
- **Don't** use the map as navigation inside your app. Markers are reference points, not controls.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | Required | Name of the area, shown in the header and used as the accessible name. |
| `markers` | `readonly MiniMapMarker[]` | Required | Places to draw. Each needs `id`, `x`, `y` and `label`; add `primary` for the emphasised one. |
| `grid` | `boolean` | `true` | Draw the hairline grid behind the markers. |
| `href` | `string` | — | Destination for the header link, e.g. a full map. |
| `linkLabel` | `ReactNode` | `"Open map"` | Text of the header link. |
| `caption` | `ReactNode` | — | Footer line, e.g. an address or opening hours. |
| `className` | `string` | — | Layout classes on the panel. |
| `...props` | `ComponentProps<"div">` | — | Standard panel props, including `ref`. Children are not accepted. |

Exports `MiniMapProps` and `MiniMapMarker` types.

## Motion

None. Markers are placed where you put them and stay there. A map that drifts or pulses reads as a live location, and this one is a static diagram.

## Accessibility

The map area is a single `role="img"` with a spoken summary of the area and every marker — “Södermalm, Stockholm. 3 places: The studio, Coffee on Hornsgatan, The park.” The dots are decorative, so no marker is a tab stop and nothing depends on hover; the primary label is visible, and the remaining labels are available on hover and in the summary. The header link is real text with its own focus ring.
