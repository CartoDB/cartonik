'use strict'

module.exports = function areValidCoords ({ z, x, y }) {
  areCoordsNumbers({ z, x, y })
  areCoordsInRange({ z, x, y })
}

function areCoordsNumbers ({ z, x, y }) {
  if (isNaN(z) || isNaN(x) || isNaN(y)) {
    throw new Error('Invalid coordinates: ' + z + '/' + x + '/' + y)
  }
}

function areCoordsInRange ({ z, x, y }) {
  const max = Math.pow(2, z)

  if (!isFinite(max) || x >= max || x < 0 || y >= max || y < 0) {
    throw new Error('Coordinates out of range: ' + z + '/' + x + '/' + y)
  }
}
