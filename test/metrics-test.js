'use strict'

const fs = require('fs')
const assert = require('./support/assert')
const { describe, it, before, after } = require('mocha')
const rendererFactory = require('../lib/renderer/renderer-factory')

const rendererOptions = {
  type: 'raster',
  xml: fs.readFileSync('./test/fixtures/mmls/world-borders-interactivity.xml', 'utf8'),
  base: './test/fixtures/datasources/shapefiles/world-borders/',
  metrics: true
}

describe('metrics', function () {
  let renderer

  before(function () {
    renderer = rendererFactory(rendererOptions)
  })

  after(async function () {
    await renderer.close()
  })

  for (const format of [ 'png', 'utf' ]) {
    it('tile 0/0/0 has stats', async function () {
      const { stats } = await renderer.getTile(format, 0, 0, 0)

      assert.ok(stats.hasOwnProperty('Mapnik'))
    })
  }
})
