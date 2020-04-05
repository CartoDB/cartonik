'use strict'

const { promisify } = require('util')
const blend = promisify(require('@carto/mapnik').blend)

module.exports = async function blend ({ coordinates, offsets, dimensions, format, quality, getTile, concurrency }) {
  const tiles = await getTilesInBatches({ coordinates, format, getTile, concurrency })

  if (!tiles || !tiles.length) {
    throw new Error('No tiles to stitch')
  }

  const stats = calculateStats({ tiles })
  const image = await blendTiles({ tiles, offsets, dimensions, format, quality })

  return { image, stats }
}

async function getTilesInBatches ({ coordinates, format, getTile, concurrency }) {
  const batches = getCoordinateBatches({ coordinates, concurrency })
  const tiles = []

  for (const coords of batches) {
    tiles.push(...await Promise.all(getTiles({ coordinates: coords, format, getTile })))
  }

  return tiles
}

function getCoordinateBatches ({ coordinates, concurrency }) {
  const batches = []

  for (let from = 0; from < coordinates.length; from += concurrency) {
    let to = from + concurrency

    if (to > coordinates.length) {
      to = coordinates.length
    }

    const batch = coordinates.slice(from, to)

    batches.push(batch)
  }

  return batches
}

function getTiles ({ coordinates, format, getTile }) {
  return coordinates.map(({ z, x, y }) => getTile(format, z, x, y)
    .then(({ buffer, stats = {} }) => ({ buffer, stats })))
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
