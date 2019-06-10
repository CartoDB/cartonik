'use strict'

module.exports = function coordinates ({ zoom, scale, center, dimensions, tileSize }) {
  const { width, height } = dimensions

  const topLeft = getTileCoordinateFromPointInPixels({ center, point: { x: 0, y: 0 }, dimensions, tileSize, scale, zoom })
  const bottomRight = getTileCoordinateFromPointInPixels({ center, point: { x: width, y: height }, dimensions, tileSize, scale, zoom })
  const coords = []

  for (let column = topLeft.column; column <= bottomRight.column; column++) {
    for (let row = topLeft.row; row <= bottomRight.row; row++) {
      coords.push({ x: column, y: row })
    }
  }

  if (!coords.length) {
    throw new Error('No coords object')
  }

  return coords
}

function getTileCoordinateFromPointInPixels ({ center, point, dimensions, tileSize, scale, zoom }) {
  const size = Math.floor(tileSize * scale)
  const maxTilesInRow = Math.pow(2, zoom)

  const centerTileCoordinates = pointToTile({ point: center, tileSize })

  const tileCordinateOffset = {
    column: (point.x - dimensions.width / 2) / size,
    row: (point.y - dimensions.height / 2) / size
  }

  const tileCoordinate = {
    column: Math.floor(centerTileCoordinates.column + tileCordinateOffset.column),
    row: Math.floor(centerTileCoordinates.row + tileCordinateOffset.row)
  }

  if (tileCoordinate.row < 0) {
    tileCoordinate.row = 0
  }

  if (tileCoordinate.row >= maxTilesInRow) {
    tileCoordinate.row = maxTilesInRow - 1
  }

  return tileCoordinate
}

function pointToTile ({ point, tileSize }) {
  return {
    column: point.x / tileSize,
    row: point.y / tileSize
  }
}
