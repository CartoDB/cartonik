'use strict'

const fs = require('fs')
const assert = require('./support/assert')
const { describe, it, before, after } = require('mocha')
const rendererFactory = require('../lib/renderer/renderer-factory')
const mapnik = require('@carto/mapnik')

const rendererOptions = {
  type: 'raster',
  xml: fs.readFileSync('./test/fixtures/mmls/world-borders.xml', 'utf8'),
  base: './test/fixtures/datasources/shapefiles/world-borders/'
}

describe('render raster tiles', function () {
  it('"jpeg:quality=20" format, tile 0/0/0', async function () {
    const options = Object.assign({}, rendererOptions, {
      xml: fs.readFileSync('./test/fixtures/mmls/world-borders-interactivity.xml', 'utf8')
    })

    const renderer = rendererFactory(options)

    const { buffer: tile, headers, stats } = await renderer.getTile('jpeg:quality=20', 0, 0, 0)

    assert.ok(stats)
    assert.ok(stats.hasOwnProperty('render'))
    assert.ok(stats.hasOwnProperty('encode'))
    assert.strictEqual(headers['Content-Type'], 'image/jpeg')
    await assert.imageEqualsFile(tile, './test/fixtures/output/pngs/world-borders-interactivity-0.0.0.jpeg', 0.05, 'jpeg:quality=20')

    await renderer.close()
  })

  it('tile 31/0/0, format png', async function () {
    const options = Object.assign({}, rendererOptions, {
      xml: fs.readFileSync('./test/fixtures/mmls/world-borders-interactivity.xml', 'utf8')
    })

    const renderer = rendererFactory(options)

    const { buffer: tile, headers } = await renderer.getTile('png', 31, 0, 0)

    assert.strictEqual(headers['Content-Type'], 'image/png')
    await assert.imageEqualsFile(tile, './test/fixtures/output/pngs/zoom-31.png')

    await renderer.close()
  })

  it('tile 31/0/0 format grid.json', async function () {
    const renderer = rendererFactory({
      type: 'raster',
      xml: fs.readFileSync('./test/fixtures/mmls/world-borders-interactivity.xml', 'utf8'),
      base: './test/fixtures/datasources/shapefiles/world-borders/'
    })

    const { buffer: tile, headers } = await renderer.getTile('utf', 31, 0, 0)

    assert.deepStrictEqual(tile, JSON.parse(fs.readFileSync('./test/fixtures/output/grids/world-borders-interactivity-31.0.0.grid.json', 'utf8')))
    assert.strictEqual(headers['Content-Type'], 'application/json')

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

  describe('world borders', function () {
    let renderer

    before(function () {
      renderer = rendererFactory(rendererOptions)
    })

    after(async function () {
      await renderer.close()
    })

    for (const coords of tileCoords) {
      it(`tile ${coords.join('/')}`, async function () {
        const { buffer: tile, headers } = await renderer.getTile('png', ...coords)

        const filepath = `./test/fixtures/output/pngs/world-borders-${coords.join('.')}.png`
        await assert.imageEqualsFile(tile, filepath)

        assert.strictEqual(headers['Content-Type'], 'image/png')
      })
    }
  })

  describe('world borders with labels and buffer-size', function () {
    let renderer

    before(function () {
      mapnik.register_default_fonts()

      const options = Object.assign({}, rendererOptions, {
        xml: fs.readFileSync('./test/fixtures/mmls/world-borders-with-labels.xml', 'utf8'),
        bufferSize: 64
      })

      renderer = rendererFactory(options)
    })

    after(async function () {
      await renderer.close()
    })

    for (const coords of tileCoords) {
      it(`tile ${coords.join('/')}`, async function () {
        const { buffer: tile, headers } = await renderer.getTile('png', ...coords)

        assert.strictEqual(headers['Content-Type'], 'image/png')

        const filepath = `./test/fixtures/output/pngs/world-borders-with-labels-${coords.join('.')}-buffersize.png`
        await assert.imageEqualsFile(tile, filepath)
      })
    }
  })

  describe('world borders interactivity', function () {
    let renderer

    before(function () {
      renderer = rendererFactory({
        type: 'raster',
        xml: fs.readFileSync('./test/fixtures/mmls/world-borders-interactivity.xml', 'utf8'),
        base: './test/fixtures/datasources/shapefiles/world-borders/'
      })
    })

    after(async function () {
      await renderer.close()
    })

    for (const coords of tileCoords) {
      it(`tile ${coords.join('/')}, format: grid.json`, async function () {
        const { buffer: tile, headers, stats } = await renderer.getTile('utf', ...coords)

        assert.ok(stats)
        assert.ok(stats.hasOwnProperty('render'))
        assert.ok(stats.hasOwnProperty('encode'))

        const expected = `./test/fixtures/output/grids/world-borders-interactivity-${coords.join('.')}.grid.json`

        assert.deepStrictEqual(tile, JSON.parse(fs.readFileSync(expected, 'utf8')))
        assert.strictEqual(headers['Content-Type'], 'application/json')
      })
    }
  })

  describe('works with variables', function () {
    const colors = [ '#A3D979', '#fffacd', '#082910' ]

    colors.forEach(function (customColor) {
      it(`color ${customColor}, tile 2/2/2`, async function () {
        const options = Object.assign({}, rendererOptions, {
          xml: fs.readFileSync('./test/fixtures/mmls/world-borders-custom-color.xml', 'utf8'),
          variables: { customColor }
        })

        const renderer = rendererFactory(options)

        const { buffer: tile, headers } = await renderer.getTile('png', 2, 2, 2)
        await assert.imageEqualsFile(tile, `./test/fixtures/output/pngs/world-borders-custom-color-2.2.2-${customColor}.png`)

        assert.strictEqual(headers['Content-Type'], 'image/png')

        await renderer.close()
      })
    })
  })

  it('works with metatiles, tile 2/2/2', async function () {
    const options = Object.assign({}, rendererOptions, {
      metatile: 4,
      metrics: true
    })

    const renderer = rendererFactory(options)
    const { stats } = await renderer.getTile('png', 2, 2, 2)

    assert.ok(stats.hasOwnProperty('Mapnik'))

    await renderer.close()
  })
})
