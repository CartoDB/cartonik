'use strict'

const fs = require('fs')
const assert = require('./support/assert')
const { describe, it, before } = require('mocha')
const rendererFactory = require('../lib/renderer/renderer-factory')

describe('pool render ', function () {
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

  describe('with poolSize = 1, poolMaxWaitingClients = 1', function () {
    let renderer

    before(function () {
      renderer = rendererFactory({
        type: 'raster',
        metatile: 4,
        xml: fs.readFileSync('./test/fixtures/mmls/world-borders.xml', 'utf8'),
        base: './test/fixtures/datasources/shapefiles/world-borders/',
        poolSize: 1,
        poolMaxWaitingClients: 1
      })
    })

    it('should throw max waitingClients count exceeded', async function () {
      let results = []

      // Use for each to run it in parallel
      tileCoords.forEach(async ([ z, x, y ]) => {
        try {
          const { tile } = await renderer.getTile('png', z, x, y)
          results.push(tile)
        } catch (err) {
          results.push(err)
        }

        if (results.length === tileCoords.length) {
          const errs = results.filter((err) => err && err.message === 'max waitingClients count exceeded')
          assert.ok(errs.length > 0)
        }
      })
    })
  })
})
