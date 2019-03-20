const fs = require('fs')
const assert = require('./support/assert')
const rasterRendererFactory = require('../../lib/raster')

describe('Pool Render ', function () {
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

  describe('getTile()', function () {
    let source

    before(function (done) {
      const uri = {
        protocol: 'mapnik:',
        metatile: 4,
        xml: fs.readFileSync('./test/raster/data/world.xml', 'utf8'),
        base: './test/raster/data/',
        query: {
          poolSize: 1,
          poolMaxWaitingClients: 1
        }
      }

      rasterRendererFactory(uri, (err, _source) => {
        if (err) {
          return done(err)
        }

        source = _source
        done()
      })
    })

    it('validate: max waitingClients count exceeded', function (done) {
      let results = []

      tileCoords.forEach(([ z, x, y ]) => {
        source.getTile(z, x, y, (err, tile) => {
          results.push(err || tile)

          if (results.length === tileCoords.length) {
            const errs = results.filter((err) => err.message === 'max waitingClients count exceeded')
            assert.ok(errs.length > 0)
            done()
          }
        })
      })
    })
  })
})
