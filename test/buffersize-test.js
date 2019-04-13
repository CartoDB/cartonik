'use strict'

const rendererFactory = require('../lib/renderer-factory')
const path = require('path')
const fs = require('fs')
const mapnik = require('@carto/mapnik')
const zlib = require('zlib')
const assert = require('assert')
const { it } = require('mocha')
const { promisify } = require('util')

const baseRendererOptions = {
  type: 'vector',
  xml: fs.readFileSync(path.join(__dirname, '/fixtures/mmls/world-borders-with-labels.xml'), 'utf8'),
  base: path.join(__dirname, '/fixtures/datasources/shapefiles/world-borders/')
}

const scenarios = [
  {
    rendererOptions: Object.assign({ bufferSize: 0 }, baseRendererOptions),
    coords: [ 1, 0, 0 ]
  },
  {
    rendererOptions: Object.assign({ bufferSize: 0 }, baseRendererOptions),
    coords: [ 2, 1, 1 ]
  },
  {
    rendererOptions: Object.assign({ bufferSize: 64 }, baseRendererOptions),
    coords: [ 1, 0, 0 ]
  },
  {
    rendererOptions: Object.assign({ bufferSize: 64 }, baseRendererOptions),
    coords: [ 2, 1, 1 ]
  }
]

scenarios.forEach(function ({ rendererOptions, coords }) {
  const renderer = rendererFactory(rendererOptions)
  const [ z, x, y ] = coords

  it(`should render vector tiles ${coords.join('/')} with buffer-size ${rendererOptions.bufferSize}`, async function () {
    const { tile, headers } = await renderer.getTile('mvt', z, x, y)

    assert.strictEqual(headers['Content-Type'], 'application/x-protobuf')
    assert.strictEqual(headers['Content-Encoding'], 'gzip')

    const buffer = await promisify(zlib.gunzip)(tile)

    const filepath = path.join(`./test/fixtures/output/pbfs/world-borders-${coords.join('.')}-buffersize-${rendererOptions.bufferSize}.pbf`)
    const expected = fs.readFileSync(filepath)
    const vtile1 = new mapnik.VectorTile(z, x, y, { buffer_size: 16 * rendererOptions.bufferSize })
    const vtile2 = new mapnik.VectorTile(z, x, y, { buffer_size: 16 * rendererOptions.bufferSize })

    vtile1.setDataSync(expected)
    vtile2.setDataSync(buffer)

    assert.vectorEqualsFile(filepath, vtile1, vtile2)
    assert.strictEqual(expected.length, buffer.length)
    assert.deepStrictEqual(expected, buffer)

    assert.strictEqual(1, renderer._mapPool.size)
    await renderer.close()
    assert.strictEqual(0, renderer._mapPool.size)
  })
})
