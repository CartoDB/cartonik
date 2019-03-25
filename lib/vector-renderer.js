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

  close () {
    return this._mapPool.drain()
      .then(() => this._mapPool.clear())
  }

  async getTile (format, z, x, y, callback) {
    const map = await this._mapPool.acquire()

    try {
      if (!(map instanceof mapnik.Map)) {
        const err = map
        throw err
      }

      const options = {}

      let vtile

      // The buffer size is in vector tile coordinates, while the buffer size on the
      // map object is in image coordinates. Therefore, lets multiply the buffer_size
      // by the old "path_multiplier" value of 16 to get a proper buffer size.

      vtile = new mapnik.VectorTile(+z, +x, +y, { buffer_size: 16 * map.bufferSize })

      map.extent = vtile.extent()

      // Since we (CARTO) are already simplifying the geometries in the Postgresql query
      // we don't want another simplification as it will have a visual impact
      options.simplify_distance = 0

      options.threading_mode = getThreadingMode(map)

      // enable strictly_simple
      options.strictly_simple = true

      // make zoom, x, y and bbox variables available to mapnik postgis datasource
      options.variables = {
        zoom_level: z, // for backwards compatibility
        zoom: z,
        x: x,
        y: y,
        bbox: JSON.stringify(map.extent)
      }

      const render = map.render.bind(map)
      const _vtile = await promisify(render)(vtile, options)

      const headers = {}

      headers['Content-Type'] = 'application/x-protobuf'
      headers['x-tilelive-contains-data'] = vtile.painted()

      if (vtile.empty()) {
        return { tile: Buffer.alloc(0), headers }
      }

      const encode = _vtile.getData.bind(_vtile)
      const pbfz = await promisify(encode)({ compression: this.gzip ? 'gzip' : 'none' })

      // TODO: research if there is performance peannalty for delaying
      // release (this._mapPool.release(map)) until finally in try catch

      if (this.gzip) {
        headers['Content-Encoding'] = 'gzip'
      }

      return { tile: pbfz, headers }
    } catch (err) {
      throw err
    } finally {
      this._mapPool.release(map)
    }
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
