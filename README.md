# Froots website

Hand-written static HTML, CSS, and JavaScript for [frootsmusic.eu](https://frootsmusic.eu/), hosted on GitHub Pages without Jekyll or a build step.

## Layout

- `index.html`: homepage
- Page folders (`about/`, `music/`, `dates/`, `impressum/`, `datenschutz/`, `indexold/`): each contains an `index.html`
- `css/`: base, layout, and reusable component stylesheets
- `js/`: shared site and page behavior
- `content/`: editable event and site-wide data in JSON files
- `images/`: site images

## Edit site content

- `content/events.json`: edit one object per event. Start new entries by copying the complete object in `content/event-template.json`, then add it to the events array. Dates use `YYYY-MM-DD` and determine whether an event appears as upcoming or past.
- `url` is optional; leave it empty if there is no venue or ticket page. `urlLabel` defaults to “More information.” Leave `poster` empty to use the logo placeholder. A price is shown when provided unless `showPrice` is `false`.
- Upcoming cards are highlighted automatically. Past events are not faded. `ticketStatus` is optional; supported values are `sold-out`, `cancelled`, and `private`.
- `content/site.json`: edit the navigation, social links, contact email, footer tagline, and legal links.
- JSON requires double-quoted keys and values and does not allow comments or trailing commas.

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
