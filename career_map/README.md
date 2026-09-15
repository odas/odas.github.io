# Career Map

A static, JSON-driven SVG career map with a plain chronological view beside it. No framework, no
build step on this side, no package dependencies. Live at https://odas.github.io/career_map/.

## Files

- `index.html` — markup and CSS (the J-visual-reference palette, light and dark).
- `map.js` — the renderer: canvas, plain view, side panel, question index, keyboard.
- `career.json` — **GENERATED. Do not hand-edit.** It is emitted from a private source file by a
  small generator that runs an allowlist projection and refuses to build on any problem. Edits made
  here are overwritten on the next build.
- `bg.jpg` — the substrate photo, used in the dark scheme only.
- `scratch/` — earlier prototypes; nothing deployed reads them.

## Views

- `?view=plain` — identity, the five proof claims, the six patterns with a one-sentence reading each,
  and the timeline newest-first. Default in portrait.
- `?view=map` — the mycelium canvas. Default in landscape. Chips at the bottom light a pattern or a
  claim's evidence on the canvas. Keys: `1–9` trunks · `←/→` nodes · `Enter` open · `P` toggle view ·
  `Q` question index · `Esc` close.
- `?scheme=light|dark` overrides the OS preference. `?debug=1` prints layout-overflow diagnostics in
  the badge (for headless checks).

## The public schema (`career.json`, `schema_version: 2`)

- `meta` — `documentTitle`, `schema_version`, `generated{on, source_sha256, generator_version}`,
  `question_taxonomy[]`.
- `identity` — `name`, `title`, `line`, `links[]`.
- `map` — `title`, `origin`, `ambientSpores[]`, `backgroundImageDark`.
- `ui` — small interface strings.
- `trunks[]` — `id`, `name`, `trigger`, `color` (a palette **token**: `cab-1`…`cab-4`, `ink`), `pos`,
  `threads[]` with `id`, `name`, `years` (short, for the canvas), `years_full`, `trigger`, `detail`,
  `plain_line`, `kind`, `employer`, `start`, `end`, `question_types[]`, `keywords[]`, `pos`.
- `throughlines[]` — `id`, `name`, `trigger`, `color` (token; `-dashed` suffix changes the dash),
  `nodeIds[]` (must all exist), optional `plain_reading`.
- `claims[]` — `id`, `sentence`, `evidence_text`, `evidence[{node_id}]`, optional `link`.
- `decisions[]` — empty until any are published.
- `chronology[]` — `id`, `start`, `end`, newest first.

The renderer accepts schema 2 only. An unknown `nodeIds` entry, a duplicate id or a missing file is
shown in the badge and nothing fictional renders.

## Local preview

```sh
python3 -m http.server 8899      # from the repository root; fetch() fails on file://
open http://127.0.0.1:8899/career_map/
```
