'use strict'

const { describe, it } = require('mocha')
const rendererFactory = require('../lib/renderer/renderer-factory')
const assert = require('assert')

describe('renderer factory', function () {
  it('should get a raster renderer instance', function () {
    const renderer = rendererFactory({ type: 'raster', xml: '<Map></Map>' })
    assert.strictEqual(renderer.constructor.name, 'RasterRenderer')
  })

  it('should get a vector renderer instance', function () {
    const renderer = rendererFactory({ type: 'vector', xml: '<Map></Map>' })
    assert.strictEqual(renderer.constructor.name, 'VectorRenderer')
  })
})
