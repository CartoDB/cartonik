'use strict'

const SphericalMercator = require('@mapbox/sphericalmercator')

module.exports = function getCenterInPixels ({ bbox, center, zoom, scale, tileSize }) {
  return bbox
  // get center coordinates in px from [w,s,e,n] bbox
    ? getCenterInPixelsFromBbox({ bbox, zoom, scale, tileSize })
  // get center coordinates in px from lng,lat
    : getCenterInPixelsFromLongLat({ center, zoom, scale, tileSize })
}

function getCenterInPixelsFromBbox ({ bbox, zoom, scale, tileSize }) {
  const { west, south, east, north } = bbox
  const sphericalMercator = new SphericalMercator({ size: tileSize * scale })
  const bottomLeft = sphericalMercator.px([west, south], zoom)
  const topRight = sphericalMercator.px([east, north], zoom)
  const width = topRight[0] - bottomLeft[0]
  const height = bottomLeft[1] - topRight[1]

  return {
    x: topRight[0] - width / 2,
    y: topRight[1] + height / 2
  }
};

function getCenterInPixelsFromLongLat ({ center, zoom, scale, tileSize }) {
  const sphericalMercator = new SphericalMercator({ size: tileSize * scale })
  const centerInPx = sphericalMercator.px([center.lng, center.lat], zoom)

  return {
    x: centerInPx[0],
    y: centerInPx[1]
  }
};
