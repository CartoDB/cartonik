'use strict'

const Pool = require('generic-pool')
const mapnik = require('@carto/mapnik')

// Create a new mapnik map object at `this.mapnik`. Requires that the mapfile
// be localized with `this.localize()`. This can be called in repetition because
// it won't recreate `this.mapnik`.
module.exports = function createMapPool (uri, xml) {
  const factory = {
    create: mapCreateFn(uri, xml),
    destroy: mapDestroyFn()
  }
  const options = {
    max: uri.query.poolSize,
    maxWaitingClients: uri.query.poolMaxWaitingClients
  }

  return Pool.createPool(factory, options)
}

function mapCreateFn (uri, xml) {
  // This function should never reject ¯\_(ツ)_/¯
  // see https://github.com/coopernurse/node-pool/issues/175
  // see https://github.com/coopernurse/node-pool/issues/183
  return function mapCreate () {
    return new Promise((resolve) => {
      try {
        const { tileSize, bufferSize } = uri.query
        const map = new mapnik.Map(tileSize, tileSize)

        map.bufferSize = bufferSize

        const mapOptions = {
          strict: uri.strict,
          base: uri.query.base
        }

        map.fromString(xml, mapOptions, (err, map) => {
          if (err) {
            return resolve(err)
          }

          return resolve(map)
        })
      } catch (err) {
        return resolve(err)
      }
    })
  }
}

function mapDestroyFn () {
  return function mapDestroy (map) {
    return new Promise((resolve) => {
      // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Delete_in_strict_mode
      map = null

      return resolve()
    })
  }
}
