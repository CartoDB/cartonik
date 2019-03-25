'use strict'

const mapnik = require('@carto/mapnik')
const defaults = require('./defaults')
const createMetatileCache = require('./metatile-cache')
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

  close () {
    this._metatileCache.clear()

    return this._mapPool.drain()
      .then(() => this._mapPool.clear())
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
        variables: this.variables || {},
        scale: this.scale
      }

      // Set x, y, z based on the metatile boundary
      options.variables.zoom = options.z

      // Set default options.
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

      const render = map.render.bind(map)
      const _image = await promisify(render)(image, options)

      // TODO: research if there is performance peannalty for delaying
      // release (this._mapPool.release(map)) until finally in try catch

      const renderStats = {
        render: Math.round((Date.now() - renderStartTime) / metatile.tiles.length)
      }

      const tiles = await this._sliceMetatile(map, _image, options, metatile, renderStats)

      return tiles
    } catch (err) {
      throw err
    } finally {
      this._mapPool.release(map)
    }
  }

  _sliceMetatile (map, image, options, metatile, stats) {
    if (metatile.tiles.length === 0) {
      return Promise.resolve({})
    }

    return Promise.all(metatile.tiles.map((coords) => {
      return new Promise((resolve, reject) => {
        const key = [ options.format, coords[0], coords[1], coords[2] ].join(',')
        const encodeStartTime = Date.now()
        const x = (coords[1] - metatile.x) * options.tileSize
        const y = (coords[2] - metatile.y) * options.tileSize

        try {
          const view = image.view(x, y, options.tileSize, options.tileSize)
          let params

          if (options.format === 'utf') {
            params = [ options ]
          } else {
            let format = options.format

            // overrides format with the default quality for "png" if defined in XML
            if (map.parameters.format && options.format === 'png') {
              format = map.parameters.format
            }

            params = [ format, options ]
          }

          view.encode(...params, (err, encodedImage) => {
            if (err) {
              return reject(err)
            }

            resolve({
              [key]: {
                tile: encodedImage,
                headers: headers(options.format),
                stats: Object.assign(stats, { encode: Date.now() - encodeStartTime }, image.get_metrics())
              }
            })
          })
        } catch (err) {
          return reject(err)
        }
      })
    }))
      .then((tiles) => Object.assign({}, ...tiles))
  }
}
