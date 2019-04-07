'use strict'

const vectorRendererFactory = require('../lib/vector-renderer')
const path = require('path')
const fs = require('fs')
const mapnik = require('@carto/mapnik')
const zlib = require('zlib')
const UPDATE = process.env.UPDATE
const assert = require('assert')
const { it } = require('mocha')
const { promisify } = require('util')

// Load fixture data.
const xml = fs.readFileSync(path.resolve(path.join(__dirname, '/fixtures/mmls/test-c.xml')), 'utf8')

var sources = {
  a: { xml, base: path.join(__dirname, '/fixtures/datasources/shapefiles/world-borders/'), bufferSize: 0 },
  b: { xml, base: path.join(__dirname, '/fixtures/datasources/shapefiles/world-borders/'), bufferSize: 64 }
}

var tests = {
  a: [{ coords: '1.0.0', bufferSize: 0 }, { coords: '2.1.1', bufferSize: 0 }],
  b: [{ coords: '1.0.0', bufferSize: 64 }, { coords: '2.1.1', bufferSize: 64 }]
}

Object.keys(tests).forEach(function (source) {
  it('setup', function () {
    const renderer = vectorRendererFactory(sources[source])
    sources[source] = renderer
  })
})
Object.keys(tests).forEach(function (source) {
  tests[source].forEach(function (test) {
    var coords = test.coords.split('.')
    var bufferSize = test.bufferSize
    var z = coords[0]
    var x = coords[1]
    var y = coords[2]

    it('should render ' + source + ' (' + test.coords + ') using buffer-size ' + bufferSize, async function () {
      const { tile, headers } = await sources[source].getTile('mvt', z, x, y)

      assert.strictEqual(headers['Content-Type'], 'application/x-protobuf')
      assert.strictEqual(headers['Content-Encoding'], 'gzip')

      const buffer = await promisify(zlib.gunzip)(tile)

      const filepath = path.join(__dirname, '/fixtures/output/' + source + '.' + test.coords + '.vector.buffer-size.' + bufferSize + '.pbf')
      if (UPDATE || !fs.existsSync(filepath)) fs.writeFileSync(filepath, buffer)

      const expected = fs.readFileSync(filepath)
      const vtile1 = new mapnik.VectorTile(+z, +x, +y, { buffer_size: 16 * test.bufferSize })
      const vtile2 = new mapnik.VectorTile(+z, +x, +y, { buffer_size: 16 * test.bufferSize })

      vtile1.setDataSync(expected)
      vtile2.setDataSync(buffer)

      assert.vectorEqualsFile(filepath, vtile1, vtile2)
      assert.strictEqual(expected.length, buffer.length)
      assert.deepStrictEqual(expected, buffer)
    })
  })
})
Object.keys(tests).forEach(function (source) {
  it('teardown', async function () {
    assert.strictEqual(1, sources[source]._mapPool.size)
    await sources[source].close()
    assert.strictEqual(0, sources[source]._mapPool.size)
  })
})
