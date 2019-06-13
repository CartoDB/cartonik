'use strict'

const coordinates = require('./coordinates')

module.exports = function getOffsetList ({ zoom, scale, center, dimensions, tileSize }) {
  return coordinates({ zoom, scale, center, dimensions, tileSize }).map((coordinate) => {
    const tileCoordinates = {
      column: coordinate.x,
      row: coordinate.y
    }

    const pointOffsetInPixels = getOffsetFromCenterInPixels({ center, tileCoordinates, dimensions, tileSize, scale })

    return {
      x: pointOffsetInPixels.x,
      y: pointOffsetInPixels.y
    }
  })
}

function getOffsetFromCenterInPixels ({ center, tileCoordinates, dimensions, tileSize, scale }) {
  const size = Math.floor(tileSize * scale)
  const centerTileCoordinates = pointToTile({ point: center, tileSize })

  const offsetInPixels = {
    x: Math.round(dimensions.width / 2 + size * (tileCoordinates.column - centerTileCoordinates.column)),
    y: Math.round(dimensions.height / 2 + size * (tileCoordinates.row - centerTileCoordinates.row))
  }

  return offsetInPixels
}

function pointToTile ({ point, tileSize }) {
  return {
    column: point.x / tileSize,
    row: point.y / tileSize
  }
}
