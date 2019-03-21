'use strict'

const LockingCache = require('./lockingcache')
const calculateMetatile = require('./metatile')

// Creates a locking cache that generates tiles. When requesting the same tile
// multiple times, they'll be grouped to one request.
module.exports = function createMetatileCache (source, tileSize, metatile, options) {
  const cacheOptions = {
    timeout: options.ttl,
    deleteOnHit: options.deleteOnHit // purge immediately after callbacks
  }

  return new LockingCache(metatileCacheGenerator(source, tileSize, metatile), cacheOptions)
}

function metatileCacheGenerator (source, tileSize, metatile) {
  return function metatileCacheGeneratorFn (cacheInput) {
    const cache = this
    const [ format, z, x, y ] = cacheInput.split(',')
    const options = { tileSize, metatile, z: +z, x: +x, y: +y }

    // Calculate bbox from xyz, respecting metatile settings.
    const metatiles = calculateMetatile(options)
    const cacheKeys = metatiles.tiles.map((tile) => format + ',' + tile.join(','))

    source._renderMetatile(format, +z, +x, +y, metatiles, (err, tiles) => {
      if (err) {
        // Push error objects to all entries that were supposed to be generated.
        return cacheKeys.forEach((key) => cache.put(key, err))
      }

      // Put all the generated tiles into the locking cache.
      cacheKeys.forEach((key) => {
        tiles[key].headers['Carto-Metatile-Cache'] = cacheInput === key ? 'MISS' : 'HIT'
        cache.put(key, null, tiles[key].image, tiles[key].headers, tiles[key].stats)
      })
    })

    return cacheKeys
  }
};
