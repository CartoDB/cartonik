'use strict'

const getZoomFromBbox = require('./zoom')

module.exports = function defaults (options) {
  if (!options.getTile) {
    throw new Error('Invalid function for getting tiles')
  }

  if (!options.center && !options.bbox) {
    throw new Error('No coordinates provided')
  }

  const getTile = options.getTile
  const bbox = options.bbox
  const center = options.center
  const dimensions = options.dimensions
  const scale = options.scale || 1
  const format = options.format || 'png'
  const quality = options.quality || null
  const limit = options.limit || 19008
  const tileSize = options.tileSize || 256
  const zoom = options.zoom || getZoomFromBbox({ dimensions, bbox, tileSize, scale })

  return { getTile, bbox, center, dimensions, zoom, scale, format, quality, limit, tileSize }
}
