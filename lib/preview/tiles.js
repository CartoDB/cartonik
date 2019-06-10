'use strict'

const coordinates = require('./coordinates')

module.exports = function tileList ({ zoom, scale, center, dimensions, tileSize }) {
  const maxTilesInRow = Math.pow(2, zoom)

  return coordinates({ zoom, scale, center, dimensions, tileSize }).map((coordinate) => {
    const tileCoordinates = {
      column: coordinate.x,
      row: coordinate.y
    }

    // Wrap tiles with negative coordinates
    tileCoordinates.column = tileCoordinates.column % maxTilesInRow

    if (tileCoordinates.column < 0) {
      tileCoordinates.column = maxTilesInRow + tileCoordinates.column
    }

    return {
      z: zoom,
      x: tileCoordinates.column,
      y: tileCoordinates.row
    }
  })
}
