'use strict'

const defaults = require('./defaults')
const getCenterInPixels = require('./center')
const getDimensions = require('./dimensions')
const getTileList = require('./tiles')
const getOffsetList = require('./offsets')
const blend = require('./blend')

module.exports = async function preview (options) {
  const {
    getTile, // getTile(format, z, x, y) -> Promise<{ buffer }|Error>
    bbox,
    center, dimensions,
    tileSize, scale, format, quality, // render options
    zoom,
    limit,
    concurrency
  } = defaults(options)

  const centerInPixels = getCenterInPixels({ bbox, center, zoom, scale, tileSize })
  const dims = getDimensions({ bbox, dimensions, zoom, scale, tileSize, limit })

  const coordinates = getTileList({ zoom, scale, center: centerInPixels, dimensions: dims, tileSize })
  const offsets = getOffsetList({ zoom, scale, center: centerInPixels, dimensions: dims, tileSize })

  const { image, stats } = await blend({
    coordinates,
    offsets,
    dimensions: dims,
    format,
    quality,
    getTile,
    concurrency
  })

  return { image, stats }
}
