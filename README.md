# Cartonik :earth_africa:

[![CircleCI](https://circleci.com/gh/CartoDB/cartonik.svg?style=svg)](https://circleci.com/gh/CartoDB/cartonik)

Render maps with `@carto/mapnik`

## :rocket: Features

- Render tiles from a Mapnik XML
- Support several formats: `png`, `jpeg`, `grid.json`, `mvt`, etc..
- Support traditional mapnik datasources: `shape`, `postgis`, `gdal`, `ogr`, etc..
- Optimized for high-performance services

## :package: Installation

Cartonik requires Node.js 10 or higher

```sh
npm install cartonik
```

## :wave: Hello Cartonik

```js
const cartonik = require('cartonik')

const renderer = cartonik({ xml: '<Map>...</Map>' })
const [ format, z, x, y ] = [ 'png', 0, 0, 0 ]

const tile = await renderer.getTile(format, z, x, y)
```

## :computer: Usage: cartonik(options)

```js
const options = { ... }
const renderer = cartonik(options)
```

## :triangular_ruler: Options

### Generic options

- `type`: `string` (either `raster` or `vector`, default `raster`). Whether the renderer aims to render Mapnik Vector Tiles or traditional raster formats (`png`, `utf`).
- `xml`: `string` (*required*). The [Mapnik XML](https://github.com/mapnik/mapnik/wiki/XMLConfigReference) configuration.
- `base`: `string`. Path to the folder where the datasources files are (e.g. shapefiles).
- `strict`: `boolean` (default `false`). Enables mapnik strict mode.
- `bufferSize`: `number` (default `256`). Extra space, in pixels, surrounding the map size being rendered. This allows you to have text and symbols rendered correctly when they overlap the image boundary.
- `poolSize`: `number` (default `os.cpus().length`). Max number of preloaded maps available for rendering.
- `poolMaxWaitingClients`: `number` (default `32`). Max number of waiting clients to acquire one of the preloaded maps.
- `tileSize`: `number` (default `256`). Size of the tile in pixels.
- `limits`: `object`.
  - `render`: `number` (default `0` = disabled). Time in milliseconds to wait for the renderer to return a tile.
- `metrics`: `boolean` (default `false`). Configure `@carto/mapnik` to gather statistics about rendering performance.
- `variables`: `object`. A key-value dictionary to customize map configuration at render-time. Placeholders defined in `xml` (e.g. `<PolygonSymbolizer fill="@water"/>`) will be replaced with the values defined here (e.g. `{ water: 'blue' }`).

### Raster options (`type` = `raster`)

- `metatile`: `number` (default `2`). The number of tiles included in a metatile. One metatile generates a group of images at once in batches before separating them into the final tiles - this improves efficiency in various ways.
- `metatileCache`: `object`.
  - `timeout`: `number` (default 1 minute). When the timeout fires, it removes the cached tiles.
  - `deleteOnHit`: `boolean` (default `false`). Removes the cached tile after delivered.
- `scale`: `number` (default `1`). Multiplier to scale up size-related properties of symbolizers.
- `resolution`: `number` (default `4`). When `format` = `utf`, the factor to scale down the tile size.

### Vector options (`type` = `vector`)

- `gzip`: `boolean` (default `true`). Compression method used to encoding a vector tile.

## :1234: Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/cartodb/cartonik/tags).

## :busts_in_silhouette: Authors

- [Daniel García Aubert](https://github.com/dgaubert)

## :page_with_curl: License

This project is licensed under the BSD 3-clause "New" or "Revised" License - see the [LICENSE](LICENSE) file for details.
