# Cartonik :earth_africa:

[![CircleCI](https://circleci.com/gh/CartoDB/cartonik.svg?style=svg)](https://circleci.com/gh/CartoDB/cartonik)

Render maps with `@carto/mapnik`

## :rocket: Features

- Render tiles from a Mapnik XML
- Support several formats: `png`, `jpeg`, `grid.json`, `mvt`, etc..
- Support traditional mapnik datasources: `shape`, `postgis`, `gdal`, `ogr`, etc..
- Render static images from tiles based on center (long, lat) or bounding box (east, south, west, north) coordinates.
- Optimized for high-performance services

## :package: Installation

Cartonik requires Node.js 10 or higher

```sh
npm install @carto/cartonik
```

## :globe_with_meridians: Render tiles

```js
const { rendererFactory } = require('@carto/cartonik')

const renderer = rendererFactory({ xml: '<Map>...</Map>' })
const [ format, z, x, y ] = [ 'png', 0, 0, 0 ]

const tile = await renderer.getTile(format, z, x, y)
```

## :computer: Usage: `rendererFactory(options)`

```js
const options = { ... }
const renderer = rendererFactory(options)
```

## :triangular_ruler: Renderer options

- `type`: `string` (either `raster` or `vector`, default `raster`). Whether the renderer aims to render Mapnik Vector Tiles or traditional raster formats (`png`, `utf`).
- `xml`: `string` (*required*). The [Mapnik XML](https://github.com/mapnik/mapnik/wiki/XMLConfigReference) configuration.
- `base`: `string`. Path to the folder where the datasource files are (e.g. shapefiles).
- `strict`: `boolean` (default `false`). Enables mapnik strict mode.
- `bufferSize`: `number` (default `256`). Extra space, in pixels, surrounding the map size being rendered. This allows you to have text and symbols rendered correctly when they overlap the image boundary.
- `poolSize`: `number` (default `os.cpus().length`). Max number of preloaded maps available for rendering.
- `poolMaxWaitingClients`: `number` (default `32`). Max number of waiting clients to acquire one of the preloaded maps.
- `tileSize`: `number` (default `256`). Size of the tile in pixels.
- `limits`: `object`.
  - `render`: `number` (default `0` = disabled). Time in milliseconds to wait for the renderer to return a tile.
- `metrics`: `boolean` (default `false`). Configure `@carto/mapnik` to gather statistics about rendering performance.
- `variables`: `object`. A key-value dictionary to customize map configuration at render-time. Placeholders defined in `xml` (e.g. `<PolygonSymbolizer fill="@water"/>`) will be replaced with the values defined here (e.g. `{ water: 'blue' }`).

### Raster renderer options (`type` = `raster`)

- `metatile`: `number` (default `2`). The number of tiles included in a metatile. One metatile generates a group of images at once in batches before separating them into the final tiles - this improves efficiency in various ways.
- `metatileCache`: `object`.
  - `timeout`: `number` (default 1 minute). When the timeout fires, it removes the cached tiles.
  - `deleteOnHit`: `boolean` (default `false`). Removes the cached tile after delivered.
- `scale`: `number` (default `1`). Multiplier to scale up size-related properties of symbolizers.
- `resolution`: `number` (default `4`). When `format` = `utf`, the factor to scale down the tile size.

### Vector renderer options (`type` = `vector`)

- `gzip`: `boolean` (default `true`). Compression method used to encoding a vector tile.

## :mag: Get information about the renderer

```js
const { rendererFactory } = require('@carto/cartonik')

const renderer = rendererFactory({ xml: '<Map>...</Map>' })

const stats = renderer.getStats()

console.log(stats)
//  Map { 'cache.png' => 1, 'pool.count' => 2, 'pool.used' => 1, 'pool.unused' => 1, 'pool.waiting' => 0 }
```

## :fireworks: Static images (previews)

```js
const { preview, rendererFactory } = require('@carto/cartonik')

const renderer = rendererFactory({ xml: '<Map>...</Map>' })

const { image } = await preview({
    center: {
        lng: -3.68529754,
        lat: 40.40197212
    },
    dimensions: {
        width: 200,
        height: 200
    },
    getTile: async function (format, x, y, z) {
        const { buffer } = await renderer.getTile(format, z, x, y)
        return { buffer }
    }
})
```

## :computer: Usage: `preview(options)`

```js
const options = { ... }
const renderer = preview(options)
```

## :triangular_ruler: Preview options

- `getTile`: `function` (*required*). Function to retrive the required tiles to build the preview image.
- `bbox`: `object`. The bounding box for the west, south, east, and north coordinates of the requested area.
  - `west`: `number`. Longitude coordinate.
  - `south`: `number`. Latitude coordinate.
  - `east`: `number`. Longitude coordinate.
  - `north`: `number`. Latitude coordinate.
- `center`: `object`. Point where the preview is centered. This option must be used along `dimensions` option.
  - `lng`: `number`. Long coordinate.
  - `lat`: `number`. Latitude coordinate.
- `dimensions`: `object`. Preview's size in pixels. This options must be defined along `center` option and will be multiplied by scale to keep the resolution.
  - `width`: `number`.
  - `heigth`: `number`.
- `zoom`: `number` default 0. The `z` cordinate, `x` and `y` will be calculated based on either `bbox` or `center` coordinates.
- `scale`: `number` [`1-4`], default `1`. Resolution (scale: `1` is `72dpi`, scale: `4`, is `288dpi`).
- `format`: `string` either `png` or `jpg`, default `png`.
- `quality`: `number`. When used with `jpg` format, accepts `1-100` and defaults to `80`. When used with `png` format, accepts `2-256` (# of colors to reduce the image to) and defaults to `null`.
- `limit`: `number` default `19008`. Max width or height of requested image in pixels. Default is 19008.
- `tileSize`: `number` default `256`. Size of tiles used in `getTile` function.
- `concurrency`: `number` default `32`. Number of concurrent calls to getTile. Useful to avoid map-pool exhaustion. Ideally, should match with `poolSize` (`os.cpus().length`) + `poolMaxWaitingClients` (`32`).

## :1234: Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/cartodb/cartonik/tags).

## :busts_in_silhouette: Contributors

- [Daniel García Aubert](https://github.com/dgaubert)
- [Raúl Marín](https://github.com/Algunenano)

## :page_with_curl: License

This project is licensed under the BSD 3-clause "New" or "Revised" License - see the [LICENSE](LICENSE) file for details.
