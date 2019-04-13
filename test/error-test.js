'use strict'

const fs = require('fs')
const assert = require('./support/assert')
const { describe, it } = require('mocha')
const rasterRendererFactory = require('../lib/raster-renderer')

const invalidXML = fs.readFileSync('./test/fixtures/mmls/invalid.xml', 'utf8')
const invalidFontFaceXML = fs.readFileSync('./test/fixtures/mmls/world-borders-invalid-font-face.xml', 'utf8')
const worldBordersBadXML = fs.readFileSync('./test/fixtures/mmls/world-borders-no-closing-tag.xml', 'utf8')
const worldBordersInteractivityXML = fs.readFileSync('./test/fixtures/mmls/world-borders-interactivity.xml', 'utf8')

const base = 'test/fixtures/datasources/shapefiles/world-borders/'

describe('error handling', function () {
  it('should throw syntax error', async function () {
    const renderer = rasterRendererFactory({ xml: invalidXML, base })

    try {
      await renderer.getTile('png', 0, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.strictEqual(err.message, 'expected < at line 1')
    }

    await renderer.close()
  })

  it('strict: false (default), should not throw error when invalid font', async function () {
    const renderer = rasterRendererFactory({ xml: invalidFontFaceXML, base })
    await renderer.getTile('png', 0, 0, 0)
    await renderer.close()
  })

  it('strict: true, should throw error', async function () {
    const renderer = rasterRendererFactory({ xml: invalidFontFaceXML, base, strict: true })

    try {
      await renderer.getTile('png', 0, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.strictEqual(err.message, 'Failed to find font face \'wadus\' in style \'world\' in TextSymbolizer')
    }

    await renderer.close()
  })

  it('should throw missing XML error', function () {
    assert.throws(() => rasterRendererFactory({}), { message: 'No XML provided' })
  })

  it('should throw invalid closing tag error', async function () {
    const renderer = rasterRendererFactory({ xml: worldBordersBadXML, base })

    try {
      await renderer.getTile('png', 0, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.strictEqual(err.message, 'invalid closing tag name at line 15')
    }

    await renderer.close()
  })

  it('should throw unknown file type error', async function () {
    const renderer = rasterRendererFactory({ xml: worldBordersInteractivityXML, base })

    try {
      await renderer.getTile('this is an invalid image format', 0, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.strictEqual(err.message, 'unknown file type: this is an invalid image format')
    }

    await renderer.close()
  })

  it('should throw compression parameter error', async function () {
    const renderer = rasterRendererFactory({ xml: worldBordersInteractivityXML, base })

    try {
      await renderer.getTile('png8:z=20', 0, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.strictEqual(err.message, 'invalid compression parameter: 20 (only -1 through 10 are valid)')
    }

    await renderer.close()
  })

  it('should throw coordinates out of range error: 0, -1, 0', async function () {
    const renderer = rasterRendererFactory({ xml: worldBordersInteractivityXML, base })

    try {
      await renderer.getTile('png', 0, -1, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.strictEqual(err.message, 'Coordinates out of range: 0/-1/0')
    }

    await renderer.close()
  })

  it('should throw coordinates out of range: 1024/0/0', async function () {
    const renderer = rasterRendererFactory({ xml: worldBordersInteractivityXML, base })

    try {
      await renderer.getTile('png', 1024, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.strictEqual(err.message, 'Coordinates out of range: 1024/0/0')
    }

    await renderer.close()
  })
})
