'use strict'

const fs = require('fs')
const assert = require('./support/assert')
const { describe, it } = require('mocha')
const rendererFactory = require('../lib/renderer-factory')

const rendererOptions = {
  type: 'raster',
  xml: fs.readFileSync('./test/fixtures/mmls/world-borders.xml', 'utf8'),
  base: './test/fixtures/datasources/shapefiles/world-borders/'
}

describe('metrics', function () {
  it('tile 0/0/0', async function () {
    const options = Object.assign({}, rendererOptions, {
      metrics: true
    })

    const renderer = rendererFactory(options)

    const { stats } = await renderer.getTile('png', 0, 0, 0)

    assert.ok(stats.hasOwnProperty('Mapnik'))
    await renderer.close()
  })
})
