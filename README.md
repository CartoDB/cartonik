# Cartonik

[![CircleCI](https://circleci.com/gh/CartoDB/cartonik.svg?style=svg)](https://circleci.com/gh/CartoDB/cartonik)

Render maps with @carto/mapnik

## Features

- Render tiles from a Mapnik XML file
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

const tile = renderer.getTile(format, z, x, y)
```

## Options

```js
const renderer = cartonik({ ...options })
```

- `xml`
- `type`
- `strict`
- `bufferSize`
- `poolSize`
- `poolMaxWaitingClients`
- `tileSize`
- `limits`
- `metrics`
- `variables`
- `metatile` when raster renderer
- `metatileCache` when raster renderer
- `scale` when raster renderer
- `gzip`  when vector renderer
