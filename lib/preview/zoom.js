'use strict'

const SphericalMercator = require('@mapbox/sphericalmercator')

// Following functionality has been influenced by leaflet's getBoundsZoom
// See http://leafletjs.com/reference.html#map-getboundszoom

module.exports = function getZoomFromBbox ({ dimensions, bbox, tileSize, scale }) {
  if (!dimensions) {
    throw new Error('Missing dimensions ({width, height}) parameter. Required when parameter bbox is not defined')
  }

  if (!bbox) {
    throw new Error('Missing bounding box ([west, south, east, north]) parameter. Required when parameter bbox is not defined')
  }

  return boundsZoom({ bbox, dimensions, tileSize, scale })
}

function subtract (pointA, pointB) {
  return [
    pointA[0] - pointB[0],
    pointA[1] - pointB[1]
  ]
}

function contains (pointA, pointB) {
  return Math.abs(pointB[0]) <= Math.abs(pointA[0]) && Math.abs(pointB[1]) <= Math.abs(pointA[1])
}

function boundsZoom ({ bbox, dimensions, tileSize, scale }) {
  const sphericalMercator = new SphericalMercator({ size: tileSize * scale })
  const { west, south, east, north } = bbox
  const { width, height } = dimensions
  const size = [ width, height ]
  const nw = [ west, north ]
  const se = [ east, south ]

  const maxZoom = 18

  let zoom = 0
  let zoomNotFound = true
  let boundsSize = null

  do {
    zoom++
    boundsSize = subtract(sphericalMercator.px(se, zoom), sphericalMercator.px(nw, zoom))
    zoomNotFound = contains(size, boundsSize)
  } while (zoomNotFound && zoom <= maxZoom)

  return zoom - 1
}
