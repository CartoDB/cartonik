var fs = require('fs')
var assert = require('assert')
const { describe, it, before, after } = require('mocha')
const rasterRendererFactory = require('../../lib/raster')

describe('Render ', function () {
  var tileCoords = [
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

  var tileCoordsCompletion = {}
  tileCoords.forEach(function (coords) {
    tileCoordsCompletion['grid_' + coords[0] + '_' + coords[1] + '_' + coords[2]] = true
  })

  describe('getGrid() ', function () {
    var source
    var completion = {}
    before(function (done) {
      rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/test.xml', 'utf8'), base: './test/raster/data/' }, function (err, s) {
        if (err) throw err
        source = s
        done()
      })
    })
    after(function (done) {
      source.close(done)
    })
    it('validates', function (done) {
      var count = 0
      tileCoords.forEach(function (coords, idx, array) {
        source.getGrid(coords[0], coords[1], coords[2], function (err, info, headers, stats) {
          assert.ifError(err)
          assert.ok(stats)
          assert.ok(stats.hasOwnProperty('render'))
          assert.ok(stats.hasOwnProperty('encode'))
          var key = coords[0] + '_' + coords[1] + '_' + coords[2]
          completion['grid_' + key] = true
          if (err) throw err
          var expected = 'test/raster/fixture/grids/' + key + '.grid.json'
          if (!fs.existsSync(expected) || process.env.UPDATE) {
            fs.writeFileSync(expected, JSON.stringify(info, null, 4))
          }
          assert.deepStrictEqual(info, JSON.parse(fs.readFileSync('test/raster/fixture/grids/' + key + '.grid.json', 'utf8')))
          assert.strictEqual(headers['Content-Type'], 'application/json')
          ++count
          if (count === array.length) {
            assert.deepStrictEqual(completion, tileCoordsCompletion)
            done()
          }
        })
      })
    })

    it('renders for zoom>30', function (done) {
      source.getGrid(31, 0, 0, function (err, info, headers) {
        if (err) throw err
        assert.deepStrictEqual(info, JSON.parse(fs.readFileSync('test/raster/fixture/grids/empty.grid.json', 'utf8')))
        assert.strictEqual(headers['Content-Type'], 'application/json')
        done()
      })
    })
  })
})

describe('Grid Render Errors ', function () {
  it('invalid layer', function (done) {
    rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/invalid_interactivity_1.xml', 'utf8'), base: './test/raster/data/' }, function (err, source) {
      if (err) throw err
      source.getGrid(0, 0, 0, function (err, info, headers) {
        assert.ok(err)
        assert.strictEqual(err.message, "Layer name 'blah' not found")
        source.close(done)
      })
    })
  })
})

describe('Grid metrics', function () {
  it('Gets metrics', function (done) {
    var uri = {
      protocol: 'mapnik:',
      xml: fs.readFileSync('./test/raster/data/test.xml', 'utf8'),
      base: './test/raster/data/',
      query: {
        metrics: true
      }
    }

    rasterRendererFactory(uri, function (err, source) {
      if (err) throw err
      source.getGrid(0, 0, 0, function (err, info, headers, stats) {
        assert(!err)
        assert.ok(stats.hasOwnProperty('Mapnik'))
        source.close(done)
      })
    })
  })
})
