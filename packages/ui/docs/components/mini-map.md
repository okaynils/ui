---
title: MiniMap
description: A small map readout with rulers, a crosshair on the place that matters and its coordinates; point at another place and the crosshair slides over.
group: Gimmicks
order: 180
---

# MiniMap

A small map readout for a footer, contact block or office page: edge rulers, a crosshair through the place that matters, and its name and coordinates in mono, like an instrument panel. Point at another marker, or tab to it, and the crosshair glides over and the readout changes. Positions are percentages you supply and coordinates are text you supply, so there are no tiles, keys, geocoding or network requests. Link out to a real map when someone needs directions.

```tsx
import { MiniMap } from "@nils/ui";
import type { MiniMapMarker, MiniMapProps } from "@nils/ui";
```

## Examples

### A place and its neighbours

The crosshair rests on the `primary` marker. Hover the other two, or tab into the map and use the arrow keys.

```tsx live
<MiniMap
  name="Södermalm, Stockholm"
  markers={[
    { id: "studio", x: 44, y: 52, label: "The studio", primary: true, lat: 59.317, lng: 18.064 },
    { id: "coffee", x: 64, y: 34, label: "Coffee on Hornsgatan", lat: 59.3186, lng: 18.0711 },
    { id: "park", x: 24, y: 72, label: "Tantolunden", lat: 59.3121, lng: 18.0498 },
  ]}
  caption="Two minutes from the water."
/>
```

### A link to the real thing

`href` adds a link in the header. `coordinates` prints any text in the readout instead of latitude and longitude.

```tsx live
<MiniMap
  name="Workshop, Copenhagen"
  href="https://example.com/maps/workshop"
  markers={[
    { id: "door", x: 58, y: 44, label: "The entrance", primary: true, coordinates: "Gate B, ground floor" },
    { id: "bike", x: 74, y: 70, label: "Bike parking", coordinates: "Courtyard" },
  ]}
  caption="Nørrebro · Wednesdays 10–16"
/>
```

### One place, no grid

With a single marker the map is a still picture: no controls, just the crosshair and readout. `grid={false}` drops the grid and rulers when the surrounding layout already has lines.

```tsx live
<MiniMap
  name="Headquarters"
  grid={false}
  markers={[{ id: "hq", x: 36, y: 46, label: "HQ", primary: true, lat: 52.52, lng: 13.405 }]}
/>
```

## Rules

- **Do** treat `x`/`y` as a share of the frame, 0–100. The map is a diagram, so place markers where they read well; `lat`/`lng` only label them.
- **Do** keep one `primary` marker. It's the accent "you are here" square, and the crosshair returns to it when the pointer leaves.
- **Do** write labels as places, not addresses: "The studio", "Bike parking".
- **Do** link out with `href` when directions matter.
- **Don't** pass coordinates you don't have. Without `lat`/`lng` or `coordinates`, the readout shows just the label.
- **Don't** embed a mapping provider or add a key. If you need real geography, render a real map and use this as a preview.
- **Don't** use markers as navigation. Pointing at one moves the crosshair; it doesn't go anywhere.

## Props

### MiniMap

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | Required | Name of the area, shown in the header and used as the accessible name. |
| `markers` | `readonly MiniMapMarker[]` | Required | Places to draw. Markers with non-finite `x`/`y` are left out. |
| `grid` | `boolean` | `true` | Draw the hairline grid and the edge rulers. |
| `href` | `string` | — | Destination for the header link, e.g. a full map. |
| `linkLabel` | `ReactNode` | `"Open map"` | Text of the header link. |
| `caption` | `ReactNode` | — | Footer line, e.g. an address or opening hours. |
| `className` | `string` | — | Layout classes on the panel. |
| `...props` | `ComponentProps<"div">` | — | Standard panel props, including `ref`. Children are not accepted. |

### MiniMapMarker

| Prop | Type | Description |
| --- | --- | --- |
| `id` | `string` | Stable identity. |
| `x`, `y` | `number` | Position as a percentage of the frame, 0 at the top left. Clamped to 0–100. |
| `label` | `string` | What's here. Shown in the readout and read aloud. |
| `primary` | `boolean` | The emphasised place; the crosshair rests on it. Without one, the first marker is home. |
| `lat`, `lng` | `number` | Real coordinates, printed as `59.3170° N, 18.0640° E`. Both are needed. |
| `coordinates` | `string` | Readout text instead of `lat`/`lng`, e.g. "Gate B, ground floor". |

## Motion

The gliding crosshair is the map's signature move. Hover or focus a marker and the two hairlines slide to it in 180ms on `ease-snap`, while the readout switches to that marker's label and coordinates. When the pointer or focus leaves the map, they return to the primary marker. Nothing moves on its own or on first render. Under `prefers-reduced-motion` the crosshair jumps instead of gliding.

## Accessibility

With one marker, the map is a single `role="img"` with a spoken summary of the area and the place. With more, it's a named group of buttons with one tab stop. Arrow keys (and Home/End) move between places; each button is named by its label and coordinates, e.g. "Coffee on Hornsgatan, 59.3186° N, 18.0711° E". The primary marker has `aria-current="location"`. The readout, rulers and crosshair are decorative, since the buttons already say everything. The header link is real text with its own focus ring.
