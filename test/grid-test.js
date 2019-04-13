'use strict'

const fs = require('fs')
const assert = require('assert')
const { describe, it, before, after } = require('mocha')
const rendererFactory = require('../lib/renderer-factory')

const rendererOptions = {
  type: 'raster',
  xml: fs.readFileSync('./test/fixtures/mmls/world-borders-interactivity.xml', 'utf8'),
  base: './test/fixtures/datasources/shapefiles/world-borders/'
}

describe('Render ', function () {
  const tileCoords = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 0, 1],
    [1, 1, 0],
    [1, 1, 1],
    [2, 0, 0],
    [2, 0, 1],
    [2, 0, 2],
    [2, 0, 3],
    [2, 1, 0],
    [2, 1, 1],
    [2, 1, 2],
    [2, 1, 3],
    [2, 2, 0],
    [2, 2, 1],
    [2, 2, 2],
    [2, 2, 3],
    [2, 3, 0],
    [2, 3, 1],
    [2, 3, 2],
    [2, 3, 3]
  ]

  describe('world borders interactivity', function () {
    let renderer

    before(function () {
      renderer = rendererFactory(rendererOptions)
    })

    after(async function () {
      await renderer.close()
    })

    for (const coords of tileCoords) {
      it(`tile ${coords.join('.')}, format: grid.json`, async function () {
        const { tile, headers, stats } = await renderer.getTile('utf', ...coords)

        assert.ok(stats)
        assert.ok(stats.hasOwnProperty('render'))
        assert.ok(stats.hasOwnProperty('encode'))

        const expected = `./test/fixtures/output/grids/world-borders-interactivity-${coords.join('.')}.grid.json`

        assert.deepStrictEqual(tile, JSON.parse(fs.readFileSync(expected, 'utf8')))
        assert.strictEqual(headers['Content-Type'], 'application/json')
      })
    }

    it('tile 31/0/0', async function () {
      const { tile, headers } = await renderer.getTile('utf', 31, 0, 0)

      assert.deepStrictEqual(tile, JSON.parse(fs.readFileSync('./test/fixtures/output/grids/world-borders-interactivity-31.0.0.grid.json', 'utf8')))
      assert.strictEqual(headers['Content-Type'], 'application/json')
    })
  })
})

describe('grid render errors ', function () {
  it('invalid layer', async function () {
    const renderer = rendererFactory(Object.assign({}, rendererOptions, {
      xml: fs.readFileSync('./test/fixtures/mmls/world-borders-invalid-interactivity.xml', 'utf8')
    }))

    try {
      await renderer.getTile('utf', 0, 0, 0)
    } catch (err) {
      assert.strictEqual(err.message, "Layer name 'blah' not found")
    } finally {
      await renderer.close()
    }
  })
})

describe('grid metrics', function () {
  it('should get metrics', async function () {
    const renderer = rendererFactory(Object.assign({}, rendererOptions, { metrics: true }))

    const { stats } = await renderer.getTile('utf', 0, 0, 0)

    assert.ok(stats.hasOwnProperty('Mapnik'))

    await renderer.close()
  })
})
