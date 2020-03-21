'use strict'

const mapnik = require('@carto/mapnik')
const timeoutDecorator = require('./timeout-decorator')
const createMapPool = require('./map-pool')
const defaults = require('./defaults')
const { promisify } = require('util')

module.exports = function vectorRendererFactory (options) {
  return new VectorRenderer(options)
}

class VectorRenderer {
  constructor (options) {
    if (!options.xml) {
      throw new Error('No XML provided')
    }

    Object.assign(this, defaults(options))

    if (this.limits.render > 0) {
      const errorMsg = 'Render timed out'
      this.getTile = timeoutDecorator(this.getTile.bind(this), this.limits.render, errorMsg)
    }

    this._mapPool = createMapPool(this, this.xml)
  }

  async close () {
    await this._mapPool.drain()
    await this._mapPool.clear()
  }

  async getTile (format, z, x, y) {
    const map = await this._mapPool.acquire()

    try {
      if (!(map instanceof mapnik.Map)) {
        const err = map
        throw err
      }

      // The buffer size is in vector tile coordinates, while the buffer size on the
      // map object is in image coordinates. Therefore, lets multiply the buffer_size
      // by the old "path_multiplier" value of 16 to get a proper buffer size.
      const vtile = new mapnik.VectorTile(+z, +x, +y, { buffer_size: 16 * map.bufferSize })

      map.extent = vtile.extent()

      const options = {
        // Since we (CARTO) are already simplifying the geometries in the Postgresql query
        // we don't want another simplification as it will have a visual impact
        simplify_distance: 0,
        threading_mode: getThreadingMode(map),
        strictly_simple: true,
        variables: {
          zoom_level: z, // for backwards compatibility (TODO: is this still legit?)
          zoom: z,
          x: x,
          y: y,
          bbox: JSON.stringify(map.extent)
        }
      }

      const render = promisify(map.render.bind(map))
      const tile = await render(vtile, options)

      const headers = {}

      headers['Content-Type'] = 'application/x-protobuf'
      headers['x-tilelive-contains-data'] = vtile.painted()

      if (vtile.empty()) {
        return { buffer: Buffer.alloc(0), headers }
      }

      const encode = promisify(tile.getData.bind(tile))
      const data = await encode({ compression: this.gzip ? 'gzip' : 'none' })

      if (this.gzip) {
        headers['Content-Encoding'] = 'gzip'
      }

      return { buffer: data, headers }
    } catch (err) {
      throw err
    } finally {
      this._mapPool.release(map)
    }
  }

  getStats () {
    const { size: count, borrowed: used, available: unused, pending: waiting } = this._mapPool
    const stats = new Map()

    for (const [stat, value] of Object.entries({ count, used, unused, waiting })) {
      stats.set(`pool.${stat}`, value)
    }

    return stats
  }
}

// We (CARTO) are using always the default value: deferred = 2;
function getThreadingMode (map) {
  const threadingType = map.parameters.threading_mode

  if (threadingType === 'auto') {
    return mapnik.threadingMode.auto // 3
  }

  if (threadingType === 'async') {
    return mapnik.threadingMode.async // 1
  }

  return mapnik.threadingMode.deferred // 2
}
