'use strict'

const mapnik = require('@carto/mapnik')
const timeoutDecorator = require('./timeout-decorator')
const createMapPool = require('./map-pool')
const normalizeURI = require('./uri')

module.exports = function vectorRendererFactory (uri, callback) {
  if (!uri.xml) {
    return callback(new Error('No XML provided'))
  }

  const renderer = new VectorRenderer(uri)

  renderer.open()
    .then(renderer => callback(null, renderer))
    .catch(err => callback(err))
}

class VectorRenderer {
  constructor (uri) {
    uri = normalizeURI(uri)

    // whether to compress the vector tiles or not, true by default
    this._gzip = typeof uri.gzip === 'boolean' ? uri.gzip : true

    if (uri.query.limits.render > 0) {
      const errorMsg = 'Render timed out'
      this.getTile = timeoutDecorator(this.getTile.bind(this), uri.query.limits.render, errorMsg)
    }

    // For currently unknown reasons map objects can currently be acquired
    // without being released under certain circumstances. When this occurs
    // a source cannot be closed fully during a copy or other operation. For
    // now error out in these scenarios as a close timeout.
    const errorMsgClose = 'Source resource pool drain timed out after 5s'
    this.close = timeoutDecorator(this.close.bind(this), 5000, errorMsgClose)

    this._mapPool = createMapPool(uri, uri.xml)
  }

  open () {
    return Promise.resolve(this)
  }

  close (callback) {
    this._mapPool.drain()
      .then(() => this._mapPool.clear())
      .then(() => callback())
      .catch((err) => callback(err))
  }

  getTile (z, x, y, callback) {
    this._mapPool.acquire()
      .then((map) => {
        if (!(map instanceof mapnik.Map)) {
          const err = map
          this._mapPool.release(map)

          throw err
        }

        const options = {}

        let vtile
        // The buffer size is in vector tile coordinates, while the buffer size on the
        // map object is in image coordinates. Therefore, lets multiply the buffer_size
        // by the old "path_multiplier" value of 16 to get a proper buffer size.
        try {
          // Try-catch is necessary here because the constructor will throw if x and y
          // are out of bounds at zoom-level z
          vtile = new mapnik.VectorTile(+z, +x, +y, { buffer_size: 16 * map.bufferSize })
        } catch (err) {
          return callback(err)
        }

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

        map.render(vtile, options, (err, vtile) => {
          this._mapPool.release(map)

          if (err) {
            return callback(err)
          }

          const headers = {}

          headers['Content-Type'] = 'application/x-protobuf'
          headers['x-tilelive-contains-data'] = vtile.painted()

          if (vtile.empty()) {
            return callback(null, Buffer.alloc(0), headers)
          }

          vtile.getData({ compression: this._gzip ? 'gzip' : 'none' }, (err, pbfz) => {
            if (err) {
              return callback(err)
            }

            if (this._gzip) {
              headers['Content-Encoding'] = 'gzip'
            }

            return callback(err, pbfz, headers)
          })
        })
      })
      .catch((err) => callback(err))
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
