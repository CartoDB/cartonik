'use strict'

const fs = require('fs')
const assert = require('./support/assert')
const { describe, it } = require('mocha')
const rendererFactory = require('../lib/renderer/renderer-factory')

describe('timeout', function () {
  const baseRendererOptions = {
    xml: fs.readFileSync('./test/fixtures/mmls/world-borders.xml', 'utf8'),
    base: './test/fixtures/datasources/shapefiles/world-borders',
    limits: {
      render: 1,
      cacheOnTimeout: true
    }
  }

  describe('raster renderer', function () {
    const rendererOptions = Object.assign({}, baseRendererOptions, { type: 'raster' })

    it('should fire timeout', async function () {
      const renderer = rendererFactory(rendererOptions)

      try {
        await renderer.getTile('png', 0, 0, 0)
        throw new Error('should not throw this error')
      } catch (err) {
        assert.strictEqual('Render timed out', err.message)
      } finally {
        await renderer.close()
      }
    })

    it('should not fire timeout', async function () {
      const opts = Object.assign({}, rendererOptions, { limits: { render: 0 } })

      const renderer = rendererFactory(opts)
      const { tile, headers } = await renderer.getTile('png', 0, 0, 0)

      assert.ok(tile)
      assert.ok(headers)

      await renderer.close()
    })
  })

  describe('vector renderer', function () {
    const rendererOptions = Object.assign({}, baseRendererOptions, { type: 'vector' })

    it('should fire timeout', async function () {
      const renderer = rendererFactory(rendererOptions)

      try {
        await renderer.getTile('mvt', 0, 0, 0)
        throw new Error('should not throw this error')
      } catch (err) {
        assert.strictEqual(err.message, 'Render timed out')
      } finally {
        await renderer.close()
      }
    })

    it('should not fire timeout', async function () {
      const opts = Object.assign({}, rendererOptions, { limits: { render: 0 } })

      const renderer = rendererFactory(opts)
      const { tile, headers } = await renderer.getTile('mvt', 0, 0, 0)

      assert.ok(tile)
      assert.ok(headers)

      await renderer.close()
    })
  })
})
