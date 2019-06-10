'use strict'

const { promisify } = require('util')
const blend = promisify(require('@carto/mapnik').blend)

module.exports = async function blend ({ coordinates, offsets, dimensions, format, quality, getTile }) {
  const tiles = await Promise.all(getTiles({ format, coordinates, getTile }))

  if (!tiles || !tiles.length) {
    throw new Error('No tiles to stitch')
  }

  const stats = calculateStats({ tiles })
  const image = await blendTiles({ tiles, offsets, dimensions, format, quality })

  return { image, stats }
}

function getTiles ({ format, coordinates, getTile }) {
  return coordinates.map(({ z, x, y }) => getTile(format, z, x, y)
    .then(({ tile, stats = {} }) => ({ buffer: tile, stats })))
}

function calculateStats ({ tiles }) {
  const numTiles = tiles.length
  const renderTotal = tiles.map(tile => tile.stats.render || 0)
    .reduce((acc, renderTime) => acc + renderTime, 0)

  const stats = {
    tiles: numTiles,
    renderAvg: Math.round(renderTotal / numTiles)
  }

  return stats
}

async function blendTiles ({ tiles, offsets, dimensions, format, quality }) {
  const buffers = tiles
    .map((tile) => tile.buffer)
    .map((buffer, index) => ({ buffer, ...offsets[index] }))

  const { width, height } = dimensions
  const options = { format, quality, width, height, reencode: true }

  const image = await blend(buffers, options)

  return image
}
