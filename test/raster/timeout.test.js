var fs = require('fs')
var assert = require('./support/assert')
const { describe, it } = require('mocha')
const rasterRendererFactory = require('../../lib/raster-renderer')

describe('Timeout', function () {
  var baseUri = {
    xml: fs.readFileSync('./test/raster/data/world.xml', 'utf8'),
    base: './test/raster/data/',
    limits: {
      render: 1,
      cacheOnTimeout: true
    },
    protocol: 'mapnik:',
    strict: false
  }

  var coords = [ 0, 0, 0 ]

  it('should fire timeout', function (done) {
    const renderer = rasterRendererFactory(baseUri)
    renderer.getTile('png', coords[0], coords[1], coords[2], function (err) {
      assert.ok(err)
      assert.strictEqual('Render timed out', err.message)
      renderer.close(done)
    })
  })

  it('should not fire timeout', function (done) {
    var uri = Object.assign({}, baseUri)
    uri.limits.render = 0
    const renderer = rasterRendererFactory(uri)
    renderer.getTile('png', coords[0], coords[1], coords[2], function (err, tile, headers) {
      assert.ifError(err)
      assert.ok(tile)
      assert.ok(headers)
      renderer.close(done)
    })
  })
})
