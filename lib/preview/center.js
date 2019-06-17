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
  const x = west + Math.abs(west - east) / 2
  const y = south + Math.abs(south - north) / 2
  const sphericalMercator = new SphericalMercator({ size: tileSize * scale })
  const centerInPx = sphericalMercator.px([x, y], zoom)

  return {
    x: centerInPx[0],
    y: centerInPx[1]
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
