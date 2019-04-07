'use strict'

const fs = require('fs')
const assert = require('./support/assert')
const { describe, it } = require('mocha')
const rasterRendererFactory = require('../lib/raster-renderer')

describe('Handling Errors ', function () {
  it('invalid style', async function () {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/fixtures/mmls/invalid_style.xml', 'utf8'), base: './test/fixtures/datasources/shapefiles/world-borders/' })
    try {
      await renderer.getTile('png', 0, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.ok((err.message.search('expected < at line 1') !== -1) || (err.message.search('XML document not') !== -1))
    }

    await renderer.close()
  })

  // See https://github.com/mapbox/tilelive-mapnik/pull/74
  it('invalid font, strict', async function () {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/fixtures/mmls/invalid_font_face.xml', 'utf8'), base: './test/fixtures/datasources/shapefiles/world-borders/', strict: true })
    try {
      await renderer.getTile('png', 0, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.ok(err.message.search('font face') !== -1, err.message)
    }

    await renderer.close()
  })

  // See https://github.com/mapbox/tilelive-mapnik/pull/74
  it('invalid font, non-strict (default)', async function () {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/fixtures/mmls/invalid_font_face.xml', 'utf8'), base: './test/fixtures/datasources/shapefiles/world-borders/' })
    await renderer.close()
  })

  it('missing data', function () {
    assert.throws(() => rasterRendererFactory({}), { message: 'No XML provided' })
  })

  it('bad style', async function () {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/fixtures/mmls/world_bad.xml', 'utf8'), base: './test/fixtures/datasources/shapefiles/world-borders/' })

    try {
      await renderer.getTile('png', 0, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.ok((err.message.search('invalid closing tag') !== -1) || (err.message.search('XML document not well formed') !== -1))
    }

    await renderer.close()
  })

  it('invalid image format', async function () {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/fixtures/mmls/test.xml', 'utf8'), base: `./test/fixtures/datasources/shapefiles/world-borders/` })

    try {
      await renderer.getTile('this is an invalid image format', 0, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.strictEqual(err.message, 'unknown file type: this is an invalid image format')
    }

    await renderer.close()
  })

  it('invalid image format 2', async function () {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/fixtures/mmls/test.xml', 'utf8'), base: './test/fixtures/datasources/shapefiles/world-borders/' })

    try {
      await renderer.getTile('png8:z=20', 0, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert(err.message.match(/invalid compression parameter: 20 \(only -1 through (9|10) are valid\)/), 'error message mismatch: ' + err.message)
    }

    await renderer.close()
  })

  it('coordinates out of range: ', async function () {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/fixtures/mmls/test.xml', 'utf8'), base: './test/fixtures/datasources/shapefiles/world-borders/' })

    try {
      await renderer.getTile('png', 0, -1, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert(err.message.match(/Coordinates out of range/), 'error message mismatch: ' + err.message)
    }

    await renderer.close()
  })

  it('coordinates out of range, not finite', async function () {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/fixtures/mmls/test.xml', 'utf8'), base: './test/fixtures/datasources/shapefiles/world-borders/' })

    try {
      await renderer.getTile('png', 1024, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert(err.message.match(/Coordinates out of range/), 'error message mismatch: ' + err.message)
    }

    await renderer.close()
  })
})
