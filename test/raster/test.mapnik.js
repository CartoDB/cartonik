var assert = require('assert')
const rasterRendererFactory = require('../../lib/raster')
var mapnik = require('@carto/mapnik')
const { describe, it } = require('mocha')

describe('.mapnik', function () {
  it('exposes the mapnik binding', function () {
    assert.strictEqual(mapnik, rasterRendererFactory.mapnik)
  })
})
