# Froots website

Hand-written static HTML, CSS, and JavaScript for [frootsmusic.eu](https://frootsmusic.eu/), hosted on GitHub Pages without Jekyll or a build step.

## Layout

- `index.html`: homepage
- Page folders (`about/`, `music/`, `dates/`, `impressum/`, `datenschutz/`, `indexold/`): each contains an `index.html`
- `css/`: base, layout, and reusable component stylesheets
- `js/`: shared site and page behavior
- `images/`: site images

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
