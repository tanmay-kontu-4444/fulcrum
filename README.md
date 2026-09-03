# Fulcrum — Championship Intelligence

A single-page web app prototype for a soccer analytics platform focused on the
English Championship. Fulcrum surfaces a **context-adjusted player performance
metric** designed for scouting — evaluating players relative to their role, the
match state, their team's strength, and the opposition they faced.

## Contents

- `index.html` — the main app (semantic HTML + embedded CSS + design system).
- `app.js` — interactivity: theme toggle, sort, filter, search, player select,
  radar chart, trend chart, action-timeline rendering.
- `data.js` — realistic Championship-style mock dataset. Structured so real
  data (players, clubs, matches, action logs) can be plugged in without any
  changes to the UI layer.

## Product positioning

- Championship-first. League One and Scottish Premiership on the roadmap.
- Built for scouts, analysts, and coaches — not a betting product, not a
  fantasy game.
- The context-adjusted score is a scouting layer, **not a replacement** for
  traditional ratings.
- A separate **match-impact rating** is planned as a future addition, clearly
  labeled in the Match Context section.

## Running locally

The project is fully static — open `index.html` in a browser, or serve the
folder from any static server:

```bash
python3 -m http.server 8000
# then visit http://127.0.0.1:8000/
```

## Design system (short version)

- **Fonts**: Cabinet Grotesk (display) · Satoshi (body) · JetBrains Mono
  (numeric values and code fragments).
- **Palette**: dark-first, warm-neutral surfaces, single "pitch-lime" accent
  (`#C7F284` dark / `#4B7B1F` light). Restrained — one accent, no gradient
  blobs, no purple.
- **Radius**: small (4–10px). No pillow corners.
- **Motion**: subtle hover states, no bouncy micro-interactions.

Themes are toggled from the top nav; the choice persists to `localStorage`.

## Data extension

Replace `window.FULCRUM_DATA` in `data.js` with real feeds. The three top-level
keys (`CLUBS`, `PLAYERS`, `MATCH_EXAMPLE`) map 1:1 to the UI regions.
