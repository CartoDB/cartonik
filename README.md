# Cartonik

[![CircleCI](https://circleci.com/gh/CartoDB/cartonik.svg?style=svg)](https://circleci.com/gh/CartoDB/cartonik)

Render maps with @carto/mapnik

## Features

- Render tiles from a Mapnik XML
- Support several formats: `png`, `jpeg`, `grid.json`, `mvt`, etc..
- Support traditional mapnik datasources: `shape`, `postgis`, `gdal`, `ogr`, etc..
- Optimized for high-performance services

## Installation

Cartonik requires Node.js 10 or higher

```bash
$ npm install cartonik
```

## Hello Cartonik

```js
const cartonik = require('cartonik')

const renderer = cartonik({ xml: '<Map>...</Map>' })
const [ format, z, x, y ] = [ 'png', 0, 0, 0 ]

const tile = await renderer.getTile(format, z, x, y)
```

## Usage

```js
const renderer = cartonik({ ...options })
```

### Options

- `xml`: String; [the Mapnik XML configuration](https://github.com/mapnik/mapnik/wiki/XMLConfigReference)
- `type`: String; `raster` or `vector`. Whether the renderer aims to render Mapnik Vector Tiles or traditional raster formats
- `strict`: Boolean;
- `bufferSize`: Number; extra space, in pixels, surrounding the map size being rendered. This allows you to have text and symbols rendered correctly when they overlap
the image boundary.
- `poolSize`: Number; max number of preloaded maps available for rendering
- `poolMaxWaitingClients`: Number; max number of waiting clients to acquire one of the preloaded maps
- `tileSize`: Number; size of the tile in pixels
- `limits`: Object;
  - `render`: Number; time in milliseconds to wait for the renderer to return a tile
- `metrics`: Boolean; configure `@carto/mapnik` to gather stats about rendering performance
- `variables`: Object;
- `metatile`: Number; when `type` = `raster`. The number of tiles included in a metatile. One metatile generates a group of images at once in batches before separating them into the final tiles - this improves efficiency in various ways.
- `metatileCache` when `type` = `raster`
- `scale`: Number; when `type` = `raster`
- `gzip`: Bolean;  when `type` = `vector`
