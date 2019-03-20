'use strict'

const EARTH_RADIUS = 6378137
const EARTH_DIAMETER = EARTH_RADIUS * 2
const EARTH_CIRCUMFERENCE = EARTH_DIAMETER * Math.PI
const MAX_RES = EARTH_CIRCUMFERENCE / 256
const ORIGIN_SHIFT = EARTH_CIRCUMFERENCE / 2

module.exports = function calculateMetatile (options) {
  const { metatile, tileSize } = options
  const { z, x, y } = parseCoords(options)
  const total = Math.pow(2, z)
  const resolution = MAX_RES / total

  // Make sure we don't calculcate a metatile that is larger than the bounds.
  const metaWidth = Math.min(metatile, total, total - x)
  const metaHeight = Math.min(metatile, total, total - y)

  const tiles = getMetatileCoords({ z, x, y, metaWidth, metaHeight })
  const bbox = getBoundingBox({ z, x, y, resolution, metaWidth, metaHeight })

  return {
    width: metaWidth * tileSize,
    height: metaHeight * tileSize,
    x,
    y,
    tiles,
    bbox
  }
}

function parseCoords (options) {
  const z = +options.z
  let x = +options.x
  let y = +options.y

  // Make sure we start at a metatile boundary.
  x -= x % options.metatile
  y -= y % options.metatile

  return { z, x, y }
}

// Generate all tile coordinates that are within the metatile.
function getMetatileCoords ({ z, x, y, metaWidth, metaHeight }) {
  const coords = []

  for (let dx = 0; dx < metaWidth; dx++) {
    for (let dy = 0; dy < metaHeight; dy++) {
      coords.push([ z, x + dx, y + dy ])
    }
  }

  return coords
}

function getBoundingBox ({ z, x, y, resolution, metaWidth, metaHeight }) {
  const minx = (x * 256) * resolution - ORIGIN_SHIFT
  const miny = -((y + metaHeight) * 256) * resolution + ORIGIN_SHIFT
  const maxx = ((x + metaWidth) * 256) * resolution - ORIGIN_SHIFT
  const maxy = -((y * 256) * resolution - ORIGIN_SHIFT)

  return [ minx, miny, maxx, maxy ]
}
