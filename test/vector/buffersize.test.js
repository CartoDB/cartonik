'use strict'

const vectorRendererFactory = require('../../lib/vector-renderer')
const path = require('path')
const fs = require('fs')
const mapnik = require('@carto/mapnik')
const zlib = require('zlib')
const UPDATE = process.env.UPDATE
const assert = require('assert')
const { it } = require('mocha')

function compareVectorTiles (assert, filepath, vtile1, vtile2) {
  assert.strictEqual(vtile1.tileSize, vtile2.tileSize)
  // assert.strictEqual(vtile1.height(),vtile2.height());
  assert.deepStrictEqual(vtile1.names(), vtile2.names())
  assert.deepStrictEqual(vtile1.names(), vtile2.names())
  // assert.strictEqual(vtile1.isSolid(),vtile2.isSolid());
  assert.strictEqual(vtile1.empty(), vtile2.empty())
  var v1 = vtile1.toJSON()
  var v2 = vtile2.toJSON()
  assert.strictEqual(v1.length, v2.length)
  var l1 = v1[0]
  var l2 = v2[0]
  assert.strictEqual(l1.name, l2.name)
  assert.strictEqual(l1.version, l2.version)
  assert.strictEqual(l1.extent, l2.extent)
  assert.strictEqual(l1.features.length, l2.features.length)
  assert.deepStrictEqual(l1.features[0], l2.features[0])

  try {
    assert.deepStrictEqual(v1, v2)
  } catch (err) {
    var e = filepath + '.expected.json'
    var a = filepath + '.actual.json'
    fs.writeFileSync(e, JSON.stringify(JSON.parse(vtile1.toGeoJSON('__all__')), null, 2))
    fs.writeFileSync(a, JSON.stringify(JSON.parse(vtile2.toGeoJSON('__all__')), null, 2))
    assert.ok(false, 'files json representations differs: \n' + e + '\n' + a + '\n')
  }
}

// Load fixture data.
const xml = fs.readFileSync(path.resolve(path.join(__dirname, '/test-c.xml')), 'utf8')

var sources = {
  a: { xml, base: path.join(__dirname, '/'), query: { bufferSize: 0 } },
  b: { xml, base: path.join(__dirname, '/'), query: { bufferSize: 64 } }
}

var tests = {
  a: [{ coords: '1.0.0', bufferSize: 0 }, { coords: '2.1.1', bufferSize: 0 }],
  b: [{ coords: '1.0.0', bufferSize: 64 }, { coords: '2.1.1', bufferSize: 64 }]
}

Object.keys(tests).forEach(function (source) {
  it('setup', function (done) {
    vectorRendererFactory(sources[source], function (err, renderer) {
      assert.ifError(err)
      sources[source] = renderer
      done()
    })
  })
})
Object.keys(tests).forEach(function (source) {
  tests[source].forEach(function (test) {
    var coords = test.coords.split('.')
    var bufferSize = test.bufferSize
    var z = coords[0]
    var x = coords[1]
    var y = coords[2]

    it('should render ' + source + ' (' + test.coords + ') using buffer-size ' + bufferSize, function (done) {
      sources[source].getTile('mvt', z, x, y, function (err, buffer, headers) {
        assert.ifError(err)
        assert.strictEqual(headers['Content-Type'], 'application/x-protobuf')
        assert.strictEqual(headers['Content-Encoding'], 'gzip')

        zlib.gunzip(buffer, function (err, buffer) {
          assert.ifError(err)

          var filepath = path.join(__dirname, '/expected/' + source + '.' + test.coords + '.vector.buffer-size.' + bufferSize + '.pbf')
          if (UPDATE || !fs.existsSync(filepath)) fs.writeFileSync(filepath, buffer)
          // fs.writeFileSync(filepath, buffer)

          var expected = fs.readFileSync(filepath)
          var vtile1 = new mapnik.VectorTile(+z, +x, +y, { buffer_size: 16 * test.bufferSize })
          var vtile2 = new mapnik.VectorTile(+z, +x, +y, { buffer_size: 16 * test.bufferSize })
          vtile1.setDataSync(expected)
          vtile2.setDataSync(buffer)
          compareVectorTiles(assert, filepath, vtile1, vtile2)
          assert.strictEqual(expected.length, buffer.length)
          assert.deepStrictEqual(expected, buffer)
          done()
        })
      })
    })
  })
})
Object.keys(tests).forEach(function (source) {
  it('teardown', function (done) {
    var s = sources[source]
    assert.strictEqual(1, s._mapPool.size)
    s.close(function () {
      assert.strictEqual(0, s._mapPool.size)
      done()
    })
  })
})
