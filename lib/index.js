'use strict'

const vectorRendererFactory = require('./vector/vector-renderer')
const rasterRendererFactory = require('./raster/raster-renderer')

module.exports = function mapnikRendererFactory (uri, callback) {
  switch (uri.format) {
    case 'mvt':
      vectorRendererFactory(uri, callback)
      break
    default:
      rasterRendererFactory(uri, callback)
      break
  }
}
