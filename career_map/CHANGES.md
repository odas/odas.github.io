# Changes

## Data and UI configuration moved into `career.json`

What changed: career-specific page metadata, map title, hint text, legend text, panel labels, throughline markers, origin coordinates, and ambient spore coordinates now live in `career.json`.

Why: the HTML should describe how to render the map, while the JSON describes what career is being rendered.

Expected benefit: replacing or editing the career requires fewer code edits and less knowledge of the renderer.

Tradeoffs: the page now depends more heavily on `career.json` being available over HTTP. Opening the HTML directly from the filesystem is not the supported path.

## Renderer initialized from loaded data

What changed: `index.html` now loads `career.json`, applies page/map UI config, then initializes the existing SVG renderer with `trunks` and `throughlines`.

Why: this keeps rendering logic separate from career content while preserving the current single-file, no-build JavaScript approach.

Expected benefit: the renderer is easier to scan because career content is no longer mixed into drawing and interaction code.

Tradeoffs: the script still lives inline in `index.html`; extracting it into a separate JavaScript file was deferred to avoid a larger rewrite.

## `index1.html` synchronized with the active renderer

What changed: `index1.html` now matches `index.html` and loads `career.json` instead of carrying a second inline copy of the career data.

Why: keeping stale embedded data in a second HTML file would make future edits ambiguous.

Expected benefit: there is one source of career data.

Tradeoffs: `index1.html` remains as a compatibility copy instead of being removed or redirected.

## Warning-only validation added

What changed: the loader now warns in the console for missing required properties, duplicate ids, and throughlines that reference missing nodes.

Why: common data mistakes should be visible during editing without preventing a partially valid map from rendering.

Expected benefit: easier debugging when editing `career.json`.

Tradeoffs: validation is intentionally lightweight. It does not enforce every type, value range, or coordinate shape.

## Documentation added

What changed: `README.md` explains the project structure and how to edit or replace the career data.

Why: future edits should not require rediscovering the JSON format from the renderer code.

Expected benefit: faster, safer content updates.

Tradeoffs: documentation must be kept in sync if the JSON schema changes.

## Assumptions

- The app is served as a static site, such as GitHub Pages or a local HTTP server.
- The existing visual design and interactions are correct and should remain unchanged.
- `index1.html` may still be linked externally, so it remains present as a compatibility copy.
- The existing `trunks` and `throughlines` structures are the public data shape to preserve.

## Intentionally unchanged

- CSS values, SVG geometry, glow filters, stroke widths, node sizing, and responsive behavior.
- Click, hover, close button, and Escape-key interactions.
- The `trunks` and `throughlines` object formats.
- The no-framework, no-build-tool setup.
- The inline renderer script in `index.html` and its compatibility copy in `index1.html`.

## Future improvements deferred

- Move the renderer script into a separate `career_map.js`.
- Add fuller schema validation for value types, coordinate lengths, colors, and empty strings.
- Add automated browser interaction tests.
- Replace `index1.html` with a redirect or remove it if it is confirmed unused.
