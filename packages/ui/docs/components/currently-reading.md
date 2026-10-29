---
title: CurrentlyReading
description: The book on your nightstand: a cover, a page block as thick as the book, and a bookmark ribbon that slides to your page.
group: Gimmicks
order: 50
---

# CurrentlyReading

The book you're reading, drawn as a book: the cover, a block of pages underneath that's as thick as the book is long, and a bookmark ribbon hanging out of the pages where you are. Next to it: the title, author, "p. 142 of 368" and an optional note. Supply book metadata and your current page from the app. This component doesn't contact a book service or store reading history. It also works for the last book you finished or a book you've paused.

```tsx
import { CurrentlyReading } from "@nils/ui";
import type { CurrentlyReadingBook, CurrentlyReadingProps, CurrentlyReadingState } from "@nils/ui";
```

## Examples

### On the nightstand

Pass a cover image URL from your own library or a book service, and `totalPages` with `page` to place the bookmark. The title can link to your own review.

```tsx live
<CurrentlyReading
  book={{
    title: "The Design of Everyday Things",
    author: "Don Norman",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Publication122/v4/c3/e2/a3/c3e2a3ac-a308-18ad-4895-6ce058b56952/9780465072996.jpg/192x288bb.jpg",
    totalPages: 368,
    href: "https://example.com/books/everyday-things",
  }}
  page={142}
  note="A few pages with coffee. Mostly underlining things about doors."
/>
```

### Update a reading log

Read some pages and the bookmark slides along the page block while the page number rolls. The application owns progress: reaching the final page doesn't silently mark a book finished; the app sets that state explicitly.

```tsx live
import { Button, CurrentlyReading } from "@nils/ui";
import { useState } from "react";

export default function Example() {
  const [page, setPage] = useState(120);
  const [finished, setFinished] = useState(false);
  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-3">
      <CurrentlyReading
        book={{
          title: "Thinking, Fast and Slow",
          author: "Daniel Kahneman",
          cover: "https://is1-ssl.mzstatic.com/image/thumb/Publication/v4/49/27/aa/4927aa90-d091-9e76-7518-a81adf07c367/9781429969352.jpg/192x288bb.jpg",
          totalPages: 499,
        }}
        page={page}
        state={finished ? "finished" : "reading"}
        note={finished ? "Finished. Keeping this one nearby." : "One chapter at a time."}
      />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" disabled={finished || page >= 499} onClick={() => setPage((current) => Math.min(499, current + 20))}>Read 20 pages</Button>
        <Button size="sm" disabled={finished} onClick={() => setFinished(true)}>Mark finished</Button>
        <Button size="sm" variant="ghost" onClick={() => { setPage(120); setFinished(false); }}>Reset demo</Button>
      </div>
    </div>
  );
}
```

### Unknown progress, paused reading and no cover

Omit page data when it isn't meaningful, such as an audiobook or an unpaginated ebook: the book has no bookmark and no page line. A paused book keeps its last known page. A missing or broken cover becomes a quiet book outline, without losing the title or author. Compare the page blocks: 777 pages is a much thicker book.

```tsx live
<div className="flex w-full max-w-sm flex-col gap-3">
  <CurrentlyReading book={{ title: "Notes from the Footpath", author: "Jamie Vale" }} note="Listening on walks; no page count to report." />
  <CurrentlyReading
    book={{
      title: "Gödel, Escher, Bach",
      author: "Douglas R. Hofstadter",
      cover: "https://is1-ssl.mzstatic.com/image/thumb/Publication221/v4/22/b8/54/22b854d1-790c-561f-b5e5-a1a1a8d2d549/6610000727728.jpg/192x288bb.jpg",
      totalPages: 777,
    }}
    page={212}
    state="paused"
    note="Saving the rest for a less busy month."
  />
</div>
```

### Loading and empty

Loading takes precedence over the supplied data. An empty bookshelf is an ordinary state, not a failure: an empty slot where a book would stand.

```tsx live
<div className="flex w-full max-w-sm flex-col gap-3">
  <CurrentlyReading book={null} loading />
  <CurrentlyReading book={null} />
</div>
```

## Rules

- **Do** supply accurate book data from your application; fetching, persistence and book-service authentication stay outside the widget.
- **Do** omit `page` or `totalPages` when the progress is unknown. The bookmark is left out rather than guessed.
- **Do** use `state="finished"` for the last book you completed. With a valid total page count, its progress is complete even if `page` was omitted.
- **Do** keep `note` to one or two sentences.
- **Don't** show several of these in a row as a reading list. It's one book on one nightstand; use a `List` or `Table` for a shelf.
- **Don't** put purchase buttons, ratings, recommendations or an entire reading list inside this small entry. Compose those separately.

## Props

### CurrentlyReading

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `book` | `CurrentlyReadingBook \| null` | — | Required metadata, or `null` for the empty state. |
| `state` | `"reading" \| "paused" \| "finished"` | `"reading"` | The reading state, shown as a dot and word above the title. Finished uses a success dot and moves the bookmark to the last page. |
| `page` | `number` | — | Current page. Finite numbers are rounded down and clamped to `0…totalPages`. Ignored for finished books. |
| `note` | `ReactNode` | — | Optional personal annotation under the page line. |
| `loading` | `boolean` | `false` | Show a reserved cover and metadata skeleton, with `aria-busy`. |
| `className` | `string` | — | Layout classes. Fills its parent up to `max-w-sm`. |
| `...props` | `ComponentProps<"div">` | — | Other wrapper props, including `ref` and an overriding accessible label. Children are not accepted. |

### CurrentlyReadingBook

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | `string` | Yes | Book title. Wraps naturally in narrow layouts. |
| `author` | `string` | Yes | Author or authors as a display string. |
| `cover` | `string` | No | Image URL, drawn 56×84px with 4px corners. Missing or failed images show a book outline. |
| `href` | `string` | No | Explicit title link, such as a review or book page. Without it the title is plain text. |
| `totalPages` | `number` | No | A finite value of at least 1, rounded down. Sets the page block's thickness (3–10px, about 1px per 80 pages) and, with `page`, the bookmark's place. Invalid values hide progress. |

## Motion

The bookmark is the widget's signature move. When `page` changes, the ribbon slides along the page block to its new place (200ms, `ease-snap`) and the changed digits of the page number roll (`NumberRoll`, 180ms), up as you read on. Nothing moves on first render and nothing loops. Under `prefers-reduced-motion` the ribbon and digits jump to their new values.

## Accessibility

- The wrapper is a labelled group, "Reading activity". Override `aria-label` if several books appear together.
- Cover artwork is decorative because the adjacent text supplies the title and author. Missing artwork never removes that text.
- Progress is plain text: "Page 142 of 368". The book drawing, page block and bookmark are decorative and hidden from assistive technology, as is the rolling number.
- The reading state is a word ("Reading", "Paused", "Finished"); its dot is supplementary.
- Title links retain native keyboard and navigation behavior, with a visible focus outline. Passive entries add no unnecessary tab stops.
