'use strict'

const mapnik = require('@carto/mapnik')
const vectorRendererFactory = require('./vector-renderer')
const rasterRendererFactory = require('./raster-renderer')

mapnik.register_default_input_plugins()

module.exports = function mapnikRendererFactory (options) {
  let renderer

  switch (options.type) {
    case 'vector':
      renderer = vectorRendererFactory(options)
      break
    default:
      renderer = rasterRendererFactory(options)
      break
  }

  return renderer
}
