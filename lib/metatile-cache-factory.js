'use strict'

const MetatileCache = require('./metatile-cache')
const calculateMetatile = require('./metatile')

module.exports = function metatileCacheFactory (renderer, tileSize, metatile, options) {
  const cacheOptions = {
    timeout: options.ttl,
    deleteOnHit: options.deleteOnHit
  }

  return new MetatileCache(
    metatileKeyGenerator(tileSize, metatile),
    metatileCacheGenerator(renderer, tileSize, metatile),
    cacheOptions
  )
}

function metatileKeyGenerator (tileSize, metatile) {
  return function metatileKeyGeneratorFn (cacheInput) {
    const [ format, z, x, y ] = cacheInput.split(',')
    const options = { tileSize, metatile, z: +z, x: +x, y: +y }
    const metatiles = calculateMetatile(options)

    const keys = metatiles.tiles.map((tile) => `${format},${tile.join(',')}`)

    return keys
  }
}

function metatileCacheGenerator (renderer, tileSize, metatile) {
  return async function metatileCacheGeneratorFn (cacheInput) {
    const [ format, z, x, y ] = cacheInput.split(',')
    const options = { tileSize, metatile, z: +z, x: +x, y: +y }
    const metatiles = calculateMetatile(options)

    const tiles = await renderer.renderMetatile(format, +z, +x, +y, metatiles)
    Object.keys(tiles).forEach(key => { tiles[key].headers['Carto-Metatile-Cache'] = cacheInput === key ? 'MISS' : 'HIT' })

    return tiles
  }
}
