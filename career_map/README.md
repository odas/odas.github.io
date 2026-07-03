# Career Map

A static, JSON-driven SVG career map. The app has no framework, build step, transpiler, or package dependencies.

## Project Structure

- `index.html`: renders the SVG map, side panel, legend, and interactions.
- `career.json`: contains the career data and career-specific UI/map configuration.
- `README.md`: editing guide.
- `CHANGES.md`: notes for the maintainability refactor.
- `index1.html`: compatibility copy of `index.html` for any existing direct links.

## JSON Structure

`career.json` has five top-level sections:

- `meta`: browser/page metadata.
- `map`: map title, origin point, and ambient background points.
- `ui`: labels and small pieces of interface text.
- `trunks`: the main career branches.
- `throughlines`: cross-cutting paths that connect nodes across trunks.

The existing `trunks` and `throughlines` formats are intentionally preserved.

## How To Edit The Career

Edit `career.json`, then reload the page through a local server or static host.

Use this local command from the repository root:

```sh
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/career_map/
```

Check the browser console after edits. The app warns about duplicate ids, missing required fields, and throughlines that reference missing nodes.

## How To Replace The Career

To reuse the renderer for another career:

1. Update `meta.documentTitle`.
2. Update `map.title`.
3. Adjust `map.origin` if the central point should move.
4. Replace the `trunks` array.
5. Replace the `throughlines` array.
6. Update `ui` labels only if the interface language should change.

Keep ids short, unique, and stable. Throughlines depend on node ids.

## How To Add Trunks

Add an object to `trunks`:

```json
{
  "id": "example-trunk",
  "name": "Example Trunk",
  "trigger": "Short panel prompt for this trunk.",
  "color": "#4ade80",
  "pos": [300, 200],
  "threads": []
}
```

Required trunk properties:

- `id`: unique id.
- `name`: label shown on the map and panel.
- `trigger`: panel text for the trunk.
- `color`: hex color used for lines, nodes, labels, and panel accents.
- `pos`: `[x, y]` coordinate in the SVG viewBox.
- `threads`: array of nodes in the trunk.

## How To Add Nodes

Add a node object inside a trunk's `threads` array:

```json
{
  "id": "example-node",
  "name": "Example Node",
  "years": "2026",
  "trigger": "Short recall trigger.",
  "detail": "Longer detail shown in the side panel.",
  "pos": [360, 260]
}
```

Required node properties:

- `id`: unique id used by throughlines.
- `name`: map and panel label.
- `years`: small date label.
- `trigger`: highlighted panel text.
- `detail`: body copy in the panel.
- `pos`: `[x, y]` coordinate in the SVG viewBox.

## How To Add Throughlines

Add an object to `throughlines`:

```json
{
  "id": "tl-example",
  "name": "Example Throughline",
  "trigger": "Short explanation of the pattern.",
  "nodeIds": ["example-node", "another-node"],
  "color": "#fbbf24"
}
```

Required throughline properties:

- `id`: unique id.
- `name`: legend and panel label.
- `trigger`: highlighted panel text.
- `nodeIds`: ordered list of existing node ids.
- `color`: hex color used for the throughline and panel accents.

The map draws throughline segments in the order listed in `nodeIds`. If a node id is missing, the app warns in the console and skips that missing point.
