'use strict'

const mapnik = require('@carto/mapnik')
const defaults = require('./defaults')
const createMetatileCache = require('./metatile-cache-factory')
const createMapPool = require('./map-pool')
const areValidCoords = require('./coords')
const timeoutDecorator = require('./timeout-decorator')
const headers = require('./headers')
const { promisify } = require('util')

module.exports = function rasterRendererFactory (options) {
  return new RasterRenderer(options)
}

class RasterRenderer {
  constructor (options) {
    if (!options.xml) {
      throw new Error('No XML provided')
    }

    Object.assign(this, defaults(options))

    if (this.limits.render > 0) {
      const erroMsg = 'Render timed out'
      this.getTile = timeoutDecorator(this.getTile.bind(this), this.limits.render, erroMsg)
    }

    this._metatileCache = createMetatileCache(this, this.tileSize, this.metatile, this.metatileCache)
    this._mapPool = createMapPool(this, this.xml)
  }

  async close () {
    this._metatileCache.clear()
    await this._mapPool.drain()
    await this._mapPool.clear()
  }

  async getTile (format, z, x, y) {
    z = +z
    x = +x
    y = +y

    areValidCoords({ z, x, y })

    const key = [format, z, x, y].join(',')
    const tile = await this._metatileCache.get(key)

    return tile
  }

  async renderMetatile (format, z, x, y, metatile) {
    const map = await this._mapPool.acquire()

    try {
      if (!(map instanceof mapnik.Map)) {
        const err = map
        throw err
      }

      const options = {
        tileSize: this.tileSize,
        buffer_size: this.bufferSize,
        format: format,
        z: z,
        x: metatile.x,
        y: metatile.y,
        metrics: this.metrics,
        variables: Object.assign({}, this.variables, { zoom: z }),
        scale: this.scale
      }

      if (options.format === 'utf') {
        if (!map.parameters.interactivity_layer || !map.parameters.interactivity_fields) {
          throw new Error('Tileset has no interactivity')
        }

        options.layer = map.parameters.interactivity_layer
        options.fields = map.parameters.interactivity_fields.split(',')
        options.resolution = this.resolution
      }

      const renderStartTime = Date.now()
      const image = new mapnik[format === 'utf' ? 'Grid' : 'Image'](metatile.width, metatile.height)

      image.metrics_enabled = options.metrics

      map.resize(metatile.width, metatile.height)
      map.extent = metatile.bbox

      const render = promisify(map.render.bind(map))
      const tile = await render(image, options)

      const stats = {
        render: Math.round((Date.now() - renderStartTime) / metatile.tiles.length)
      }

      const tiles = await Promise.all(metatile.tiles.map(coords => sliceMetatile(coords, map, tile, options, metatile, stats)))

      return Object.assign({}, ...tiles)
    } catch (err) {
      throw err
    } finally {
      this._mapPool.release(map)
    }
  }

  getStats () {
    const { size: count, borrowed: used, available: unused, pending: waiting, spareResourceCapacity: remaining } = this._mapPool
    const pool = { count, used, unused, waiting, remaining }
    const cacheResults = this._metatileCache.results || {}
    const cache = Object.keys(cacheResults).reduce((cacheStats, key) => {
      const [ format ] = key.split(',')

      if (!cacheStats[format]) {
        cacheStats[format] = 0
      }

      cacheStats[format] += 1

      return cacheStats
    }, {})

    const stats = new Map()

    for (const [name, resource] of Object.entries({ pool, cache })) {
      for (const [stat, value] of Object.entries(resource)) {
        stats.set(`${name}.${stat}`, value)
      }
    }

    return stats
  }
}

async function sliceMetatile (coords, map, image, options, metatile, stats) {
  const encodeStartTime = Date.now()
  const key = [ options.format, coords[0], coords[1], coords[2] ].join(',')
  const x = (coords[1] - metatile.x) * options.tileSize
  const y = (coords[2] - metatile.y) * options.tileSize

  const view = image.view(x, y, options.tileSize, options.tileSize)
  let params = [ options ]

  if (options.format !== 'utf') {
    // overrides format with the default quality for "png" if defined in XML
    params.unshift(map.parameters.format && options.format === 'png' ? map.parameters.format : options.format)
  }

  const encode = promisify(view.encode.bind(view))
  const buffer = await encode(...params)

  return {
    [key]: {
      buffer,
      headers: headers(options.format),
      stats: Object.assign(stats, { encode: Date.now() - encodeStartTime }, image.get_metrics())
    }
  }
}
