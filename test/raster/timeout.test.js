const fs = require('fs')
const assert = require('./support/assert')
const { describe, it } = require('mocha')
const rasterRendererFactory = require('../../lib/raster-renderer')

describe('Timeout', function () {
  const options = {
    xml: fs.readFileSync('./test/raster/data/world.xml', 'utf8'),
    base: './test/raster/data/',
    limits: {
      render: 1,
      cacheOnTimeout: true
    },
    strict: false
  }

  it('should fire timeout', async function () {
    const renderer = rasterRendererFactory(options)

    try {
      await renderer.getTile('png', 0, 0, 0)
    } catch (err) {
      assert.strictEqual('Render timed out', err.message)
    } finally {
      await renderer.close()
    }
  })

  it('should not fire timeout', async function () {
    const opts = Object.assign({}, options)
    opts.limits.render = 0

    const renderer = rasterRendererFactory(opts)
    const { tile, headers } = await renderer.getTile('png', 0, 0, 0)

    assert.ok(tile)
    assert.ok(headers)

    await renderer.close()
  })
})
