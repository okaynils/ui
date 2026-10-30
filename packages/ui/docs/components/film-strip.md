---
title: FilmStrip
description: Recently watched films as posters on a strip of film, or as a diary of dates, ratings, likes and rewatches; a newly logged film advances the strip one frame.
group: Gimmicks
order: 290
---

# FilmStrip

What you've been watching, the way CurrentlyReading shows your book. As a **strip**, the latest posters sit in the frames of a piece of film, with sprocket holes along both edges, and a readout underneath names the frame you point at. As a **diary**, one film per row with the date, Letterboxd-style half-star rating, like and rewatch. Your app supplies the films, typically from a Letterboxd diary feed; the widget never fetches.

```tsx
import { FilmStrip } from "@nils/ui";
import type { Film, FilmStripProps, FilmStripVariant } from "@nils/ui";
```

## Examples

### Recently watched

Point at a poster to read its title, rating and date. Without a pointer or focus, the readout names the latest film.

```tsx live
<FilmStrip
  href="https://letterboxd.com/"
  linkLabel="Letterboxd"
  films={[
    { id: "e5", title: "Past Lives", year: 2023, rating: 4.5, liked: true, watchedAt: "2026-10-27", poster: "https://upload.wikimedia.org/wikipedia/en/d/da/Past_Lives_film_poster.png" },
    { id: "e4", title: "Aftersun", year: 2022, rating: 5, liked: true, watchedAt: "2026-10-24", poster: "https://upload.wikimedia.org/wikipedia/en/1/11/Aftersun.jpg" },
    { id: "e3", title: "Paris, Texas", year: 1984, rating: 4, rewatch: true, watchedAt: "2026-10-19", poster: "https://upload.wikimedia.org/wikipedia/en/d/db/Paris%2C_Texas_%281984_film_poster%29.png" },
    { id: "e2", title: "Lost in Translation", year: 2003, rating: 4, watchedAt: "2026-10-12", poster: "https://upload.wikimedia.org/wikipedia/en/4/4c/Lost_in_Translation_poster.jpg" },
    { id: "e1", title: "In the Mood for Love", year: 2000, rating: 4.5, liked: true, watchedAt: "2026-10-05", poster: "https://upload.wikimedia.org/wikipedia/en/4/45/In_the_Mood_for_Love_movie.jpg" },
  ]}
/>
```

### Logging a film

When a film with a new `id` arrives at the front, the strip advances one frame: the whole piece of film, sprocket holes included, pulls through to make room for it.

```tsx live
import { useState } from "react";
import { Button, FilmStrip } from "@nils/ui";

const LOGGED = [
  { id: "e4", title: "Aftersun", year: 2022, rating: 5, liked: true, watchedAt: "2026-10-24", poster: "https://upload.wikimedia.org/wikipedia/en/1/11/Aftersun.jpg" },
  { id: "e3", title: "Paris, Texas", year: 1984, rating: 4, rewatch: true, watchedAt: "2026-10-19", poster: "https://upload.wikimedia.org/wikipedia/en/d/db/Paris%2C_Texas_%281984_film_poster%29.png" },
  { id: "e2", title: "Lost in Translation", year: 2003, rating: 4, watchedAt: "2026-10-12", poster: "https://upload.wikimedia.org/wikipedia/en/4/4c/Lost_in_Translation_poster.jpg" },
  { id: "e1", title: "In the Mood for Love", year: 2000, rating: 4.5, liked: true, watchedAt: "2026-10-05", poster: "https://upload.wikimedia.org/wikipedia/en/4/45/In_the_Mood_for_Love_movie.jpg" },
];

const NEXT = { id: "e5", title: "Past Lives", year: 2023, rating: 4.5, liked: true, watchedAt: "2026-10-27", poster: "https://upload.wikimedia.org/wikipedia/en/d/da/Past_Lives_film_poster.png" };

export default function Example() {
  const [films, setFilms] = useState(LOGGED);
  const logged = films[0]?.id === NEXT.id;
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <FilmStrip films={films} max={4} />
      <Button size="sm" onClick={() => setFilms(logged ? LOGGED : [NEXT, ...LOGGED])}>
        {logged ? "Reset" : "Log Past Lives"}
      </Button>
    </div>
  );
}
```

### Diary

`variant="diary"` lists one film per row: date, poster, title and year, then the rating in Letterboxd's notation, a heart if liked and a loop if it was a rewatch. A newly logged entry lands with the change flash.

```tsx live
<FilmStrip
  variant="diary"
  label="Diary"
  films={[
    { id: "e5", title: "Past Lives", year: 2023, rating: 4.5, liked: true, watchedAt: "2026-10-27", poster: "https://upload.wikimedia.org/wikipedia/en/d/da/Past_Lives_film_poster.png" },
    { id: "e4", title: "Aftersun", year: 2022, rating: 5, liked: true, watchedAt: "2026-10-24", poster: "https://upload.wikimedia.org/wikipedia/en/1/11/Aftersun.jpg" },
    { id: "e3", title: "Paris, Texas", year: 1984, rating: 4, rewatch: true, watchedAt: "2026-10-19", poster: "https://upload.wikimedia.org/wikipedia/en/d/db/Paris%2C_Texas_%281984_film_poster%29.png" },
    { id: "e2", title: "Columbus", year: 2017, watchedAt: "2026-10-12", poster: "https://upload.wikimedia.org/wikipedia/en/d/d6/ColumbusPoster.jpg" },
  ]}
/>
```

### Favourites

Four favourites, like a Letterboxd profile: the same strip, with no dates. Favourites aren't in the diary feed, so list them yourself.

```tsx live
<FilmStrip
  label="Favourites"
  max={4}
  films={[
    { id: "f1", title: "In the Mood for Love", year: 2000, poster: "https://upload.wikimedia.org/wikipedia/en/4/45/In_the_Mood_for_Love_movie.jpg" },
    { id: "f2", title: "Spirited Away", year: 2001, poster: "https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png" },
    { id: "f3", title: "Paris, Texas", year: 1984, poster: "https://upload.wikimedia.org/wikipedia/en/d/db/Paris%2C_Texas_%281984_film_poster%29.png" },
    { id: "f4", title: "Columbus", year: 2017, poster: "https://upload.wikimedia.org/wikipedia/en/d/d6/ColumbusPoster.jpg" },
  ]}
/>
```

## Letterboxd data

Letterboxd's official API needs approval, but every member has a public diary feed at `https://letterboxd.com/<username>/rss/`. Each `<item>` carries everything a `Film` needs. Fetch it on your server (the feed doesn't allow browser requests from other sites) and pass the result in:

```ts
import type { Film } from "@nils/ui";

export async function letterboxdDiary(username: string): Promise<Film[]> {
  const xml = await (await fetch(`https://letterboxd.com/${username}/rss/`)).text();
  const tag = (item: string, name: string) =>
    item.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1]?.trim();

  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .map(([, item]) => item)
    // Lists and reviews without a watch share the feed; keep diary entries only.
    .filter((item) => tag(item, "letterboxd:watchedDate"))
    .map((item) => ({
      id: tag(item, "guid")!,
      title: tag(item, "letterboxd:filmTitle")!,
      year: Number(tag(item, "letterboxd:filmYear")) || undefined,
      rating: Number(tag(item, "letterboxd:memberRating")) || undefined,
      liked: tag(item, "letterboxd:memberLike") === "Yes",
      rewatch: tag(item, "letterboxd:rewatch") === "Yes",
      watchedAt: tag(item, "letterboxd:watchedDate"),
      href: tag(item, "link"),
      poster: item.match(/<img src="([^"]+)"/)?.[1],
    }));
}
```

Cache it: the feed updates when you log something, so an hourly refresh is plenty.

## Rules

- **Do** pass films newest first, with a stable `id` per diary entry (the feed's `guid`). The id is what tells the strip a film is new.
- **Do** fetch Letterboxd (or any service) on your server and cache it. The widget only renders what it's given.
- **Do** use `strip` for a glance (five posters) and `diary` where dates and ratings matter.
- **Don't** show ratings you didn't give. Leave `rating` out for unrated films; nothing is drawn.
- **Don't** put more than one strip in a view. It's a personal touch, not a catalogue; use a `Table` or `List` for a full history.

## Props

### FilmStrip

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `films` | `readonly Film[]` | Required | Newest first. |
| `variant` | `"strip" \| "diary"` | `"strip"` | Posters on a piece of film, or one row per film. |
| `label` | `ReactNode` | `"Recently watched"` | `ui-label` above the films. Pass `null` to hide it. |
| `href` | `string` | — | A profile page, linked at the right of the label. |
| `linkLabel` | `ReactNode` | `"Profile"` | Text of that link, e.g. `"Letterboxd"`. |
| `max` | `number` | `5` (strip), `8` (diary) | How many films to show. |
| `locale` | `string` | `"en-GB"` | Date formatting. |
| `timeZone` | `string` | `"UTC"` | Zone for dates with a time. `YYYY-MM-DD` strings are calendar dates and never shift. |
| `className` | `string` | — | Layout classes. Full width up to 448px. |
| `...props` | `ComponentProps<"div">` | — | Standard attributes, including `ref`. |

### Film

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Stable identity per entry. |
| `title` | `string` | Film title. |
| `year` | `number` | Release year, shown in mono. |
| `poster` | `string` | Poster URL (2:3). Missing posters show the title on a blank frame. |
| `href` | `string` | The film's or entry's page; makes the poster or title a link. |
| `rating` | `number` | 0.5–5 in half steps, shown as ★★★★½. |
| `liked` | `boolean` | Shows a heart. |
| `rewatch` | `boolean` | Shows a loop. |
| `watchedAt` | `Date \| string \| number` | When it was watched. |

## Motion

Advancing is the strip's signature move. When films with new ids arrive at the front, the whole reel, posters and sprocket holes together, slides right by that many frames in 200ms on `ease-snap`, like film pulled through a projector gate. Nothing moves on first render. Pointing at a poster dims the others (120ms) so the readout's film stands out. In the diary, a new entry gets the change flash instead. Under `prefers-reduced-motion` the strip updates in place.

## Accessibility

Each poster is a link (with `href`) or a button, named in full: "Past Lives (2023), rated 4.5 out of 5, liked, watched 27 October 2026". The readout under the strip repeats that visually and is hidden from assistive technology. Diary rows give the rating as "Rated 4.5 out of 5", and the heart and loop icons are labelled "Liked" and "Rewatched". Dates are `<time>` elements.
