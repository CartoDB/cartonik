'use strict'

const vectorRendererFactory = require('./vector')
const rasterRendererFactory = require('./raster')

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
