# Froots website

Hand-written static HTML, CSS, and JavaScript for [frootsmusic.eu](https://frootsmusic.eu/), hosted on GitHub Pages without Jekyll or a build step.

## Layout

- `index.html`: homepage
- Page folders (`about/`, `music/`, `dates/`, `impressum/`, `datenschutz/`, `indexold/`): each contains an `index.html`
- `css/`: base, layout, and reusable component stylesheets
- `js/`: shared site and page behavior
- `content/`: editable event data
- `images/`: site images

## Edit site content

- `content/events.js`: edit the `window.frootsEvents` array, one object per event. Start new entries by copying the complete object in `content/event-template.json`. Dates use `YYYY-MM-DD` and determine whether an event appears as upcoming or past. The data-only script loads before the page body on event pages so cards are ready before layout and scroll restoration.
- `url` is optional; leave it empty if there is no venue or ticket page. `urlLabel` defaults to “More information.” Leave `poster` empty to use the logo placeholder. A price is shown when provided unless `showPrice` is `false`.
- Upcoming cards are highlighted automatically. Past events are not faded. `ticketStatus` is optional; supported values are `sold-out`, `cancelled`, and `private`.
- The navigation and footer are static HTML in each page so they render immediately. When changing shared navigation/footer links, update the corresponding markup across the page files.
- Event data uses JavaScript object-literal syntax. Keep the surrounding `window.frootsEvents = [` and `];` lines in place.

## Run locally

From the repository root, run:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000/>.

## URL rules

- Use root-relative paths for internal links and assets, such as `/css/base.css`.
- Link to pages with a trailing slash, such as `/about/`; link to the homepage with `/`.
- Add each new page as a new folder containing `index.html`.
