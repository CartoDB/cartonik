'use strict'

const rendererFactory = require('../lib/renderer/renderer-factory')
const fs = require('fs')
const mapnik = require('@carto/mapnik')
const zlib = require('zlib')
const createMapPool = require('../lib/renderer/map-pool')
const defaults = require('../lib/renderer/defaults')
const assert = require('assert')
const { describe, it } = require('mocha')
const { promisify } = require('util')

const worldBordersGeocoderOptions = {
  type: 'vector',
  xml: fs.readFileSync('./test/fixtures/mmls/world-borders-geocoder.xml', 'utf8'),
  base: './test/fixtures/datasources/shapefiles/world-borders',
  blank: true
}

const worldBordersCenteredOptions = {
  type: 'vector',
  xml: fs.readFileSync('./test/fixtures/mmls/world-borders-centered.xml', 'utf8'),
  base: './test/fixtures/datasources/shapefiles/world-borders'
}

const worldBordersLabelsOptions = {
  type: 'vector',
  xml: fs.readFileSync('./test/fixtures/mmls/world-borders-with-labels.xml', 'utf8'),
  base: './test/fixtures/datasources/shapefiles/world-borders',
  blank: false
}

describe('render vector tiles', function () {
  it('should fail with out of bounds x or y', async function () {
    const renderer = rendererFactory(worldBordersGeocoderOptions)
    try {
      await renderer.getTile('mvt', 0, 0, 1)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.strictEqual(err.message, 'required parameter y is out of range of possible values based on z value')
    } finally {
      await renderer.close()
    }
  })

  it('should fail without xml', function () {
    assert.throws(() => rendererFactory({}), { message: 'No XML provided' })
  })

  it('should fail with invalid xml', async function () {
    const renderer = rendererFactory({ type: 'vector', xml: 'bogus' })

    try {
      await renderer.getTile('mvt', 0, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.strictEqual(err.message, 'expected < at line 1')
    } finally {
      await renderer.close()
    }
  })

  it('should fail with invalid xml at map.acquire', async function () {
    const renderer = rendererFactory({ type: 'vector', xml: '<Map></Map>' })
    const uri = defaults({})

    renderer._mapPool = createMapPool(uri, 'bogus xml')

    try {
      await renderer.getTile('mvt', 0, 0, 0)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.strictEqual(err.message, 'expected < at line 1')
    } finally {
      await renderer.close()
    }
  })

  const scenarios = [
    {
      description: 'world borders geocoder, blank: true, 0/0/0',
      options: worldBordersGeocoderOptions,
      coords: [ 0, 0, 0 ],
      empty: false,
      expected: './test/fixtures/output/pbfs/world-borders-geocoder-0.0.0.pbf'
    },
    {
      description: 'world borders geocoder, blank: true, 1/0/0',
      options: worldBordersGeocoderOptions,
      coords: [ 1, 0, 0 ],
      empty: false,
      expected: './test/fixtures/output/pbfs/world-borders-geocoder-1.0.0.pbf'
    },
    {
      description: 'world borders geocoder, blank: true, 1/0/1',
      options: worldBordersGeocoderOptions,
      coords: [ 1, 0, 1 ],
      empty: false,
      expected: './test/fixtures/output/pbfs/world-borders-geocoder-1.0.1.pbf'
    },
    {
      description: 'world borders geocoder, blank: true, 10/0/0',
      options: worldBordersGeocoderOptions,
      coords: [ 10, 0, 0 ],
      empty: true,
      expected: './test/fixtures/output/pbfs/world-borders-geocoder-10.0.0.pbf'
    },
    {
      description: 'world borders geocoder, blank: true, 10/765/295',
      options: worldBordersGeocoderOptions,
      coords: [ 10, 765, 295 ],
      empty: false,
      expected: './test/fixtures/output/pbfs/world-borders-geocoder-10.765.295.pbf'
    },
    {
      description: 'world borders centered, 0/0/0',
      options: worldBordersCenteredOptions,
      coords: [ 0, 0, 0 ],
      empty: false,
      expected: './test/fixtures/output/pbfs/world-borders-centered-0.0.0.pbf'
    },
    {
      description: 'world borders labels, blank: false, 10/0/0',
      options: worldBordersLabelsOptions,
      coords: [ 10, 0, 0 ],
      empty: true,
      expected: './test/fixtures/output/pbfs/world-borders-labels-10.0.0.pbf'
    },
    {
      description: 'world borders labels, blank: false, 10/765/295',
      options: worldBordersLabelsOptions,
      coords: [ 10, 765, 295 ],
      empty: false,
      expected: './test/fixtures/output/pbfs/world-borders-labels-10.765.295.pbf'
    },
    {
      description: 'should render vector tiles 1/0/0 with buffer-size 0',
      options: Object.assign({ bufferSize: 0 }, worldBordersLabelsOptions),
      coords: [ 1, 0, 0 ],
      empty: false,
      expected: './test/fixtures/output/pbfs/world-borders-1.0.0-buffersize-0.pbf'
    },
    {
      description: 'should render vector tiles 2/1/1 with buffer-size 0',
      options: Object.assign({ bufferSize: 0 }, worldBordersLabelsOptions),
      coords: [ 2, 1, 1 ],
      empty: false,
      expected: './test/fixtures/output/pbfs/world-borders-2.1.1-buffersize-0.pbf'
    },
    {
      description: 'should render vector tiles 1/0/0 with buffer-size 64',
      options: Object.assign({ bufferSize: 64 }, worldBordersLabelsOptions),
      coords: [ 1, 0, 0 ],
      empty: false,
      expected: './test/fixtures/output/pbfs/world-borders-1.0.0-buffersize-64.pbf'
    },
    {
      description: 'should render vector tiles 2/1/1 with buffer-size 64',
      options: Object.assign({ bufferSize: 64 }, worldBordersLabelsOptions),
      coords: [ 2, 1, 1 ],
      empty: false,
      expected: './test/fixtures/output/pbfs/world-borders-2.1.1-buffersize-64.pbf'
    }
  ]

  scenarios.forEach(({ description, options, coords, empty, expected }) => {
    const renderer = rendererFactory(options)

    it(description, async function () {
      const [ z, x, y ] = coords
      const { tile, headers } = await renderer.getTile('mvt', ...coords)

      if (empty) {
        assert.strictEqual(tile.length, 0)
        assert.strictEqual(headers['x-tilelive-contains-data'], false)
        return
      }

      assert.strictEqual(headers['Content-Type'], 'application/x-protobuf')
      assert.strictEqual(headers['Content-Encoding'], 'gzip')

      const buffer = await promisify(zlib.gunzip)(tile)

      const expectedBuffer = fs.readFileSync(expected)
      const vtile1 = new mapnik.VectorTile(z, x, y)
      const vtile2 = new mapnik.VectorTile(z, x, y)

      vtile1.setDataSync(expectedBuffer)
      vtile2.setDataSync(buffer)

      assert.vectorEqualsFile(expected, vtile1, vtile2)
      assert.strictEqual(expectedBuffer.length, buffer.length)
      assert.deepStrictEqual(expectedBuffer, buffer)

      assert.strictEqual(1, renderer._mapPool.size)
      await renderer.close()
      assert.strictEqual(0, renderer._mapPool.size)
    })
  })
})
