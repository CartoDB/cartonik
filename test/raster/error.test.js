'use strict'

const fs = require('fs')
const assert = require('./support/assert')
const { describe, it } = require('mocha')
const rasterRendererFactory = require('../../lib/raster-renderer')

describe('Handling Errors ', function () {
  it('invalid style', function (done) {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/invalid_style.xml', 'utf8'), base: './test/raster/data/' })
    renderer.getTile('png', 0, 0, 0, function (err) {
      assert.ok(err)
      // first message is from rapidxml, second is from libxml2
      assert.ok((err.message.search('expected < at line 1') !== -1) || (err.message.search('XML document not') !== -1))
      done()
    })
  })

  // See https://github.com/mapbox/tilelive-mapnik/pull/74
  it('invalid font, strict', function (done) {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/invalid_font_face.xml', 'utf8'), base: './test/raster/data/', strict: true })
    renderer.getTile('png', 0, 0, 0, function (err) {
      assert.ok(err)
      assert.ok(err.message.search('font face') !== -1, err.message)
      done()
    })
  })

  // See https://github.com/mapbox/tilelive-mapnik/pull/74
  it('invalid font, non-strict (default)', function (done) {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/invalid_font_face.xml', 'utf8'), base: './test/raster/data/' })
    renderer.close(done)
  })

  it('missing data', function () {
    assert.throws(() => rasterRendererFactory({}), { message: 'No XML provided' })
  })

  it('bad style', function (done) {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/world_bad.xml', 'utf8'), base: './test/raster/data/' })
    renderer.getTile('png', 0, 0, 0, function (err) {
      assert.ok(err)
      assert.ok((err.message.search('invalid closing tag') !== -1) || (err.message.search('XML document not well formed') !== -1))
      done()
    })
  })

  it('invalid image format', function (done) {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/test.xml', 'utf8'), base: './test/raster/data/' })
    renderer.getTile('this is an invalid image format', 0, 0, 0, function (err) {
      assert.strictEqual(err.message, 'unknown file type: this is an invalid image format')
      renderer.close(done)
    })
  })

  it('invalid image format 2', function (done) {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/test.xml', 'utf8'), base: './test/raster/data/' })
    renderer.getTile('png8:z=20', 0, 0, 0, function (err, tile, headers) {
      assert(err.message.match(/invalid compression parameter: 20 \(only -1 through (9|10) are valid\)/), 'error message mismatch: ' + err.message)
      renderer.close(done)
    })
  })

  it('coordinates out of range: ', function (done) {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/test.xml', 'utf8'), base: './test/raster/data/' })
    renderer.getTile('png', 0, -1, 0, function (err) {
      assert(err.message.match(/Coordinates out of range/), 'error message mismatch: ' + err.message)
      renderer.close(done)
    })
  })

  it('coordinates out of range, not finite', function (done) {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/test.xml', 'utf8'), base: './test/raster/data/' })
    renderer.getTile('png', 1024, 0, 0, function (err) {
      assert(err.message.match(/Coordinates out of range/), 'error message mismatch: ' + err.message)
      renderer.close(done)
    })
  })
})
