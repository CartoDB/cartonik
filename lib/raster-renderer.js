'use strict'

const mapnik = require('@carto/mapnik')
const normalizeURI = require('./uri')
const createMetatileCache = require('./metatile-cache')
const createMapPool = require('./map-pool')
const areValidCoords = require('./coords')
const timeoutDecorator = require('./timeout-decorator')
const headers = require('./headers')

module.exports = function rasterRendererFactory (uri, callback) {
  if (!uri.xml) {
    return callback(new Error('No XML provided'))
  }

  const renderer = new RasterRenderer(uri)

  renderer.open()
    .then(renderer => callback(null, renderer))
    .catch(err => callback(err))
}

module.exports.mapnik = mapnik

class RasterRenderer {
  constructor (uri) {
    this._open = false

    this._uri = normalizeURI(uri)

    if (this._uri.query.limits && this._uri.query.limits.render > 0) {
      const erroMsg = 'Render timed out'
      this.getTile = timeoutDecorator(this.getTile.bind(this), this._uri.query.limits.render, erroMsg)
      this.getGrid = timeoutDecorator(this.getGrid.bind(this), this._uri.query.limits.render, erroMsg)
    }

    this._metatileCache = createMetatileCache(this, this._uri.query.tileSize, this._uri.query.metatile, this._uri.query.metatileCache)
    this._mapPool = createMapPool(this._uri, this._uri.xml)
  }

  open () {
    return this._mapPool.acquire()
      .then((map) => {
        if (!(map instanceof mapnik.Map)) {
          const err = map
          this._mapPool.release(map)

          throw err
        }

        this._format = map.parameters.format
        this._open = true

        this._mapPool.release(map)

        return this
      })
  }

  close (callback) {
    if (!this._open) {
      return callback()
    }

    this._metatileCache.clear()

    return this._mapPool.drain()
      .then(() => this._mapPool.clear())
      .then(() => {
        this._open = false
        return callback()
      })
      .catch(err => callback(err))
  }

  getTile (z, x, y, callback) {
    const format = this._format || 'png'
    this._renderTile(format, z, x, y, callback)
  }

  getGrid (z, x, y, callback) {
    const format = 'utf'
    this._renderTile(format, z, x, y, callback)
  }

  _renderTile (format, z, x, y, callback) {
    z = +z
    x = +x
    y = +y

    try {
      areValidCoords({ z, x, y })
    } catch (err) {
      return callback(err)
    }

    const key = [format, z, x, y].join(',')

    this._metatileCache.get(key, callback)
  }

  _renderMetatile (format, z, x, y, metatile, callback) {
    this._mapPool.acquire()
      .then((resource) => {
        if (!(resource instanceof mapnik.Map)) {
          const err = resource
          this._mapPool.release(resource)

          throw err
        }

        const map = resource

        try {
          const options = {
            tileSize: this._uri.query.tileSize,
            buffer_size: this._uri.query.bufferSize,
            format: format,
            z: z,
            x: metatile.x,
            y: metatile.y,
            metrics: this._uri.query.metrics,
            variables: this._uri.query.variables || {},
            scale: this._uri.query.scale
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
            options.resolution = this._uri.query.resolution
          }

          const renderStartTime = Date.now()

          const image = new mapnik[format === 'utf' ? 'Grid' : 'Image'](metatile.width, metatile.height)

          image.metrics_enabled = options.metrics

          map.resize(metatile.width, metatile.height)
          map.extent = metatile.bbox

          map.render(image, options, (err, image) => {
            this._mapPool.release(map)

            if (err) {
              return callback(err)
            }

            const renderStats = {
              render: Math.round((Date.now() - renderStartTime) / metatile.tiles.length)
            }

            return this._sliceMetatile(image, options, metatile, renderStats, callback)
          })
        } catch (err) {
          this._mapPool.release(map)
          return callback(err)
        }
      })
      .catch((err) => {
        return callback(err)
      })
  }

  _sliceMetatile (image, options, metatile, stats, callback) {
    if (metatile.tiles.length === 0) {
      return callback(null, {})
    }

    Promise.all(metatile.tiles.map((coords) => {
      return new Promise((resolve, reject) => {
        const key = [ options.format, coords[0], coords[1], coords[2] ].join(',')
        const encodeStartTime = Date.now()
        const x = (coords[1] - metatile.x) * options.tileSize
        const y = (coords[2] - metatile.y) * options.tileSize

        try {
          const view = image.view(x, y, options.tileSize, options.tileSize)

          const params = options.format === 'utf' ? [ options ] : [ options.format, options ]
          view.encode(...params, (err, encodedImage) => {
            if (err) {
              return reject(err)
            }

            resolve({
              [key]: {
                image: encodedImage,
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
      .then((tiles) => callback(null, Object.assign({}, ...tiles)))
      .catch((err) => callback(err))
  }
}
