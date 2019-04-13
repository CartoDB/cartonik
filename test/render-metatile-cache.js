'use strict'

const fs = require('fs')
const assert = require('./support/assert')
const rendererFactory = require('../lib/renderer-factory')
const { describe, it, before, after } = require('mocha')

describe('render metatile cache-headers ', function () {
  const scenario = [
    { coords: [0, 0, 0], metatileCacheHeader: 'MISS' },

    { coords: [1, 0, 0], metatileCacheHeader: 'MISS' },
    { coords: [1, 0, 1], metatileCacheHeader: 'HIT' },
    { coords: [1, 1, 0], metatileCacheHeader: 'HIT' },
    { coords: [1, 1, 1], metatileCacheHeader: 'HIT' },

    { coords: [2, 0, 0], metatileCacheHeader: 'MISS' },
    { coords: [2, 0, 1], metatileCacheHeader: 'HIT' },
    { coords: [2, 1, 0], metatileCacheHeader: 'HIT' },
    { coords: [2, 1, 1], metatileCacheHeader: 'HIT' },

    { coords: [2, 0, 2], metatileCacheHeader: 'MISS' },
    { coords: [2, 0, 3], metatileCacheHeader: 'HIT' },
    { coords: [2, 1, 2], metatileCacheHeader: 'HIT' },
    { coords: [2, 1, 3], metatileCacheHeader: 'HIT' },

    { coords: [2, 2, 0], metatileCacheHeader: 'MISS' },
    { coords: [2, 2, 1], metatileCacheHeader: 'HIT' },
    { coords: [2, 3, 0], metatileCacheHeader: 'HIT' },
    { coords: [2, 3, 1], metatileCacheHeader: 'HIT' },

    { coords: [2, 2, 2], metatileCacheHeader: 'MISS' },
    { coords: [2, 2, 3], metatileCacheHeader: 'HIT' },
    { coords: [2, 3, 2], metatileCacheHeader: 'HIT' },
    { coords: [2, 3, 3], metatileCacheHeader: 'HIT' }
  ]

  let renderer

  before(function () {
    renderer = rendererFactory({
      type: 'raster',
      xml: fs.readFileSync('./test/fixtures/mmls/world-borders.xml', 'utf8'),
      base: './test/fixtures/datasources/shapefiles/world-borders/',
      metatile: 2
    })
  })

  after(async function () {
    await renderer.close()
  })

  scenario.forEach(({ coords, metatileCacheHeader }) => {
    it(`header "Carto-Metatile-Cache" for tile ${coords.join(',')} should be equal to ${metatileCacheHeader}`, async function () {
      const [ z, x, y ] = coords
      const { headers } = await renderer.getTile('png', z, x, y)

      assert.strictEqual(headers['Carto-Metatile-Cache'], metatileCacheHeader, `Tile: ${coords.join(',')}; Expected: ${metatileCacheHeader}; Actual: ${headers['Carto-Metatile-Cache']}`)
    })
  })
})
