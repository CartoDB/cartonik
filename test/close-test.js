'use strict'

const fs = require('fs')
const assert = require('assert')
const { describe, it } = require('mocha')
const rendererFactory = require('../lib/renderer/renderer-factory')

describe('renderer close behaviour', function () {
  const rendererOptions = {
    type: 'raster',
    xml: fs.readFileSync('./test/fixtures/mmls/world-borders.xml', 'utf8'),
    base: './test/fixtures/datasources/shapefiles/world-borders/'
  }

  it('should close cleanly after getting the renderer', async function () {
    const renderer = rendererFactory(rendererOptions)
    await renderer.close()
  })

  it('should close cleanly after getting one tile', async function () {
    const renderer = rendererFactory(rendererOptions)
    await renderer.getTile('png', 0, 0, 0)
    await renderer.close()
  })

  it('should throw with invalid usage (close before getTile)', async function () {
    const renderer = rendererFactory(rendererOptions)

    // pool will be draining...
    renderer.close()

    try {
      await renderer.getTile('png', 0, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.strictEqual(err.message, 'pool is draining and cannot accept work')
    }
  })

  it('should throw with invalid usage (close after getTile)', async function () {
    const renderer = rendererFactory(rendererOptions)

    await renderer.getTile('png', 0, 0, 0)

    // pool will be draining...
    renderer.close()

    try {
      // now that the pool is draining further
      // access to the source is invalid and should throw
      await renderer.getTile('png', 0, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.strictEqual(err.message, 'pool is draining and cannot accept work')
    }
  })
})
