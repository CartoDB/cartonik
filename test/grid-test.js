const fs = require('fs')
const assert = require('assert')
const { describe, it, before, after } = require('mocha')
const rasterRendererFactory = require('../lib/raster-renderer')

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

  const tileCoordsCompletion = {}

  tileCoords.forEach(function (coords) {
    tileCoordsCompletion['grid_' + coords[0] + '_' + coords[1] + '_' + coords[2]] = true
  })

  describe('getGrid() ', function () {
    let renderer
    const completion = {}

    before(function () {
      renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/fixtures/mmls/test.xml', 'utf8'), base: './test/fixtures/datasources/shapefiles/world-borders/' })
    })

    after(async function () {
      await renderer.close()
    })

    it('validates', async function () {
      let count = 0

      for (const coords of tileCoords) {
        const { tile, headers, stats } = await renderer.getTile('utf', coords[0], coords[1], coords[2])

        assert.ok(stats)
        assert.ok(stats.hasOwnProperty('render'))
        assert.ok(stats.hasOwnProperty('encode'))

        const key = coords[0] + '_' + coords[1] + '_' + coords[2]
        completion['grid_' + key] = true

        const expected = './test/fixtures/output/grids/' + key + '.grid.json'
        if (!fs.existsSync(expected) || process.env.UPDATE) {
          fs.writeFileSync(expected, JSON.stringify(tile, null, 4))
        }

        assert.deepStrictEqual(tile, JSON.parse(fs.readFileSync('./test/fixtures/output/grids/' + key + '.grid.json', 'utf8')))
        assert.strictEqual(headers['Content-Type'], 'application/json')

        ++count
        if (count === tileCoords.length) {
          assert.deepStrictEqual(completion, tileCoordsCompletion)
        }
      }
    })

    it('renders for zoom>30', async function () {
      const { tile, headers } = await renderer.getTile('utf', 31, 0, 0)
      assert.deepStrictEqual(tile, JSON.parse(fs.readFileSync('./test/fixtures/output/grids/empty.grid.json', 'utf8')))
      assert.strictEqual(headers['Content-Type'], 'application/json')
    })
  })
})

describe('Grid Render Errors ', function () {
  it('invalid layer', async function () {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/fixtures/mmls/invalid_interactivity_1.xml', 'utf8'), base: './test/fixtures/datasources/shapefiles/world-borders/' })

    try {
      await renderer.getTile('utf', 0, 0, 0)
    } catch (err) {
      assert.strictEqual(err.message, "Layer name 'blah' not found")
    } finally {
      await renderer.close()
    }
  })
})

describe('Grid metrics', function () {
  it('Gets metrics', async function () {
    const uri = {
      xml: fs.readFileSync('./test/fixtures/mmls/test.xml', 'utf8'),
      base: './test/fixtures/datasources/shapefiles/world-borders/',
      metrics: true
    }

    const renderer = rasterRendererFactory(uri)

    const { stats } = await renderer.getTile('utf', 0, 0, 0)

    assert.ok(stats.hasOwnProperty('Mapnik'))

    await renderer.close()
  })
})
