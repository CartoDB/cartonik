var fs = require('fs')
var assert = require('./support/assert')
const { describe, it, before } = require('mocha')
const rasterRendererFactory = require('../../lib/raster-renderer')
const mapnik = require('@carto/mapnik')

describe('Render ', function () {
  it('getTile() "jpeg:quality=20" format', async function () {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/test.xml', 'utf8'), base: './test/raster/data/' })

    const { tile, headers, stats } = await renderer.getTile('jpeg:quality=20', 0, 0, 0)

    assert.ok(stats)
    assert.ok(stats.hasOwnProperty('render'))
    assert.ok(stats.hasOwnProperty('encode'))
    assert.strictEqual(headers['Content-Type'], 'image/jpeg')
    await assert.imageEqualsFile(tile, 'test/raster/fixture/tiles/world-jpeg20.jpeg', 0.05, 'jpeg:quality=20')

    await renderer.close()
  })

  it('getTile() renders zoom>30', async function () {
    const renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/test.xml', 'utf8'), base: './test/raster/data/' })

    const { tile, headers } = await renderer.getTile('png', 31, 0, 0)

    assert.strictEqual(headers['Content-Type'], 'image/png')
    await assert.imageEqualsFile(tile, './test/raster/fixture/tiles/zoom-31.png')

    await renderer.close()
  })

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
    tileCoordsCompletion['tile_' + coords[0] + '_' + coords[1] + '_' + coords[2]] = true
  })

  describe('getTile() ', function () {
    let renderer
    const completion = {}

    before(function () {
      renderer = rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/world.xml', 'utf8'), base: './test/raster/data/' })
    })

    it('validates', async function () {
      let count = 0

      for (const coords of tileCoords) {
        const { tile, headers } = await renderer.getTile('png', coords[0], coords[1], coords[2])

        if (tile.solid) {
          assert.strictEqual(Object.keys(renderer.solidCache).length, 1)
        }

        const key = coords[0] + '_' + coords[1] + '_' + coords[2]
        await assert.imageEqualsFile(tile, './test/raster/fixture/tiles/transparent_' + key + '.png')
        completion['tile_' + key] = true
        assert.strictEqual(headers['Content-Type'], 'image/png')
        ++count
        if (count === tileCoords.length) {
          assert.deepStrictEqual(completion, tileCoordsCompletion)
          await renderer.close()
        }
      }
    })
  })

  describe('getTile() with buffer-size', function () {
    const tileCompletion = {}
    const tiles = [
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

    tiles.forEach(function (coords) {
      tileCompletion['tile_buffer_size_' + coords[0] + '_' + coords[1] + '_' + coords[2]] = true
    })

    let renderer
    const completion = {}

    before(function () {
      renderer = rasterRendererFactory({
        xml: fs.readFileSync('./test/raster/data/world_labels.xml', 'utf8'),
        base: './test/raster/data/',
        bufferSize: 0
      })
    })

    it('validates buffer-size', async function () {
      let count = 0
      for (const coords of tiles) {
        const { tile, headers } = await renderer.getTile('png', coords[0], coords[1], coords[2])
        const key = coords[0] + '_' + coords[1] + '_' + coords[2]
        const filepath = './test/raster/fixture/tiles/buffer_size_' + key + '.png'
        const resultImage = mapnik.Image.fromBytesSync(tile)

        resultImage.save(filepath)

        await assert.imageEqualsFile(tile, filepath)
        completion['tile_buffer_size_' + key] = true
        assert.strictEqual(headers['Content-Type'], 'image/png')
        ++count
        if (count === tiles.length) {
          assert.deepStrictEqual(completion, tileCompletion)
          await renderer.close()
        }
      }
    })
  })

  const TESTCOLOR = [ '#A3D979', '#fffacd', '#082910' ]
  describe('Works with render time variables', function () {
    TESTCOLOR.forEach(function (customColor) {
      it('Color ' + customColor, async function () {
        const options = {
          xml: fs.readFileSync('./test/raster/data/world_variable.xml', 'utf8'),
          base: './test/raster/data/',
          variables: { customColor }
        }

        const renderer = rasterRendererFactory(options)
        const { tile, headers } = await renderer.getTile('png', 2, 2, 2)
        await assert.imageEqualsFile(tile, './test/raster/fixture/tiles/transparent_2_2_2_' + customColor + '.png')
        assert.strictEqual(headers['Content-Type'], 'image/png')
        await renderer.close()
      })
    })
  })

  it('Works with metatiles', async function () {
    const uri = {
      xml: fs.readFileSync('./test/raster/data/world.xml', 'utf8'),
      base: './test/raster/data/',
      metatile: 4,
      metrics: true
    }

    const renderer = rasterRendererFactory(uri)
    const { stats } = await renderer.getTile('png', 2, 2, 2)
    assert.ok(stats.hasOwnProperty('Mapnik'))
    await renderer.close()
  })
})

describe('getTile() metrics', function () {
  it('Gets metrics', async function () {
    const uri = {
      xml: fs.readFileSync('./test/raster/data/world.xml', 'utf8'),
      base: './test/raster/data/',
      metrics: true
    }

    const renderer = rasterRendererFactory(uri)
    const { stats } = await renderer.getTile('png', 0, 0, 0)

    assert.ok(stats.hasOwnProperty('Mapnik'))
    await renderer.close()
  })
})
