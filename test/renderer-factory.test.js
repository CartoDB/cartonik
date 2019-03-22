const { describe, it } = require('mocha')
const rendererFactory = require('../lib/renderer-factory')
const assert = require('assert')

describe('Renderer factory', function () {
  it('should get a raster renderer instance', function (done) {
    rendererFactory({ type: 'raster', xml: '<Map></Map>' }, function (err, renderer) {
      assert.ifError(err)
      assert.strictEqual(renderer.constructor.name, 'RasterRenderer')
      done()
    })
  })
  it('should get a vector renderer instance', function (done) {
    rendererFactory({ type: 'vector', xml: '<Map></Map>' }, function (err, renderer) {
      assert.ifError(err)
      assert.strictEqual(renderer.constructor.name, 'VectorRenderer')
      done()
    })
  })
})
