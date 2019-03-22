'use strict'

const vectorRendererFactory = require('../../lib/vector-renderer')
const path = require('path')
const fs = require('fs')
const mapnik = require('@carto/mapnik')
const zlib = require('zlib')
const UPDATE = process.env.UPDATE
const createMapPool = require('../../lib/map-pool')
const defaults = require('../../lib/defaults')
const assert = require('assert')
const { it } = require('mocha')

// Load fixture data.
const xml = {
  a: fs.readFileSync(path.resolve(path.join(__dirname, '/test-a.xml')), 'utf8'),
  b: fs.readFileSync(path.resolve(path.join(__dirname, '/test-b.xml')), 'utf8'),
  c: fs.readFileSync(path.resolve(path.join(__dirname, '/test-c.xml')), 'utf8'),
  itp: fs.readFileSync(path.resolve(path.join(__dirname, '/itp.xml')), 'utf8'),
  carmen_a: fs.readFileSync(path.resolve(path.join(__dirname, '/test-carmenprops-a.xml')), 'utf8')
}

it('should fail without xml', function () {
  assert.throws(() => vectorRendererFactory({}), { message: 'No XML provided' })
})

it('should fail with invalid xml', function (done) {
  const renderer = vectorRendererFactory({ xml: 'bogus' })
  renderer.getTile('mvt', 0, 0, 0, function (err) {
    assert.strictEqual(err.message, 'expected < at line 1')
    done()
  })
})
it('should fail with invalid xml at map.acquire', function (done) {
  const renderer = vectorRendererFactory({ xml: '<Map></Map>' })
  // manually break the map pool to deviously trigger later error
  // this should never happen in reality but allows us to
  // cover this error case nevertheless
  const uri = defaults({})
  renderer._mapPool = createMapPool(uri, 'bogus xml')
  renderer.getTile('mvt', 0, 0, 0, function (err, buffer, headers) {
    assert.strictEqual(err.message, 'expected < at line 1')
    renderer.close(done)
  })
})
it('should fail with out of bounds x or y', function (done) {
  const renderer = vectorRendererFactory({ xml: xml.a, base: path.join(__dirname, '/') })
  renderer.getTile('mvt', 0, 0, 1, function (err, buffer, headers) {
    assert.strictEqual(err.message, 'required parameter y is out of range of possible values based on z value')
    done()
  })
})
it('should load with callback', function (done) {
  const renderer = vectorRendererFactory({ xml: xml.a, base: path.join(__dirname, '/') })
  renderer.close(done)
})

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

var sources = {
  a: { xml: xml.a, base: path.join(__dirname, '/'), blank: true },
  b: { xml: xml.b, base: path.join(__dirname, '/') },
  c: { xml: xml.a, base: path.join(__dirname, '/'), blank: false }
}
var tests = {
  a: ['0.0.0', '1.0.0', '1.0.1', { key: '10.0.0', empty: true }, { key: '10.765.295' }],
  b: ['0.0.0'],
  c: [{ key: '10.0.0', empty: true }, { key: '10.765.295' }]
}
Object.keys(tests).forEach(function (source) {
  it('setup', function () {
    sources[source] = vectorRendererFactory(sources[source])
  })
})
Object.keys(tests).forEach(function (source) {
  tests[source].forEach(function (obj) {
    var key = obj.key ? obj.key : obj
    var z = key.split('.')[0] | 0
    var x = key.split('.')[1] | 0
    var y = key.split('.')[2] | 0
    it('should render ' + source + ' (' + key + ')', function (done) {
      sources[source].getTile('mvt', z, x, y, function (err, buffer, headers) {
        // Test that empty tiles are so.
        if (obj.empty) {
          assert.strictEqual(buffer.length, 0)
          assert.strictEqual(headers['x-tilelive-contains-data'], false)
          return done()
        }

        assert.ifError(err)
        assert.strictEqual(headers['Content-Type'], 'application/x-protobuf')
        assert.strictEqual(headers['Content-Encoding'], 'gzip')

        // Test solid key generation.
        if (obj.solid) assert.strictEqual(buffer.solid, obj.solid)

        zlib.gunzip(buffer, function (err, buffer) {
          assert.ifError(err)

          var filepath = path.join(__dirname, '/expected/' + source + '.' + key + '.vector.pbf')
          if (UPDATE || !fs.existsSync(filepath)) fs.writeFileSync(filepath, buffer)

          var expected = fs.readFileSync(filepath)
          var vtile1 = new mapnik.VectorTile(+z, +x, +y)
          var vtile2 = new mapnik.VectorTile(+z, +x, +y)
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
