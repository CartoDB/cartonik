'use strict'

const fs = require('fs')
const assert = require('assert')
const { describe, it } = require('mocha')
const rasterRendererFactory = require('../../lib/raster-renderer')

describe('Closing behavior ', function () {
  it('should close cleanly after getting the renderer', async function () {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/world.xml', 'utf8'), base: './test/raster/data/' })
    await renderer.close()
  })

  it('should close cleanly after getting one tile', async function () {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/world.xml', 'utf8'), base: './test/raster/data/' })
    await renderer.getTile('png', 0, 0, 0)
    await renderer.close()
  })

  it('should throw with invalid usage (close before getTile)', async function () {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/world.xml', 'utf8'), base: './test/raster/data/' })
    // now close the source
    // now that the pool is draining further
    // access to the source is invalid and should throw
    renderer.close() // pool will be draining...

    try {
      await renderer.getTile('png', 0, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.strictEqual(err.message, 'pool is draining and cannot accept work')
    }
  })

  it('should throw with invalid usage (close after getTile)', async function () {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/world.xml', 'utf8'), base: './test/raster/data/' })

    await renderer.getTile('png', 0, 0, 0)

    // now close the source
    renderer.close() // pool will be draining...

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
