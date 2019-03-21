'use strict'

const mapnik = require('@carto/mapnik')
const vectorRendererFactory = require('./vector-renderer')
const rasterRendererFactory = require('./raster-renderer')

mapnik.register_default_input_plugins()

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
