'use strict'

const Pool = require('generic-pool')
const mapnik = require('@carto/mapnik')
const { promisify } = require('util')

// Create a new mapnik map object at `this.mapnik`. Requires that the mapfile
// be localized with `this.localize()`. This can be called in repetition because
// it won't recreate `this.mapnik`.
module.exports = function createMapPool (uri, xml) {
  const factory = {
    create: mapCreateFn(uri, xml),
    destroy: mapDestroyFn()
  }
  const options = {
    max: uri.poolSize,
    maxWaitingClients: uri.poolMaxWaitingClients
  }

  return Pool.createPool(factory, options)
}

function mapCreateFn (options, xml) {
  // This function should never throw ¯\_(ツ)_/¯
  // see https://github.com/coopernurse/node-pool/issues/175
  // see https://github.com/coopernurse/node-pool/issues/183
  return async function mapCreate () {
    try {
      const { tileSize, bufferSize, strict, base } = options
      const map = new mapnik.Map(tileSize, tileSize)

      map.bufferSize = bufferSize

      const load = promisify(map.fromString.bind(map))
      const mapOptions = { strict, base }

      return await load(xml, mapOptions)
    } catch (err) {
      return err
    }
  }
}

function mapDestroyFn () {
  return async function mapDestroy (map) {
    // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Delete_in_strict_mode
    map = null
  }
}
