const assert = require('assert')
const { describe, it } = require('mocha')
const normalizeURI = require('../../lib/raster/uri')
const fs = require('fs')

describe('uri query options', function () {
  describe('metatileCache config', function () {
    function makeUri (metatileCache) {
      return {
        query: {
          metatileCache: metatileCache
        }
      }
    }

    const scenarios = [
      {
        desc: 'handles no config as default values',
        metatileCache: undefined,
        expected: {
          ttl: 0,
          deleteOnHit: false
        }
      },
      {
        desc: 'handles default values',
        metatileCache: {},
        expected: {
          ttl: 0,
          deleteOnHit: false
        }
      },
      {
        desc: 'handles ttl',
        metatileCache: {
          ttl: 1000
        },
        expected: {
          ttl: 1000,
          deleteOnHit: false
        }
      },
      {
        desc: 'handles deleteOnHit',
        metatileCache: {
          deleteOnHit: false
        },
        expected: {
          ttl: 0,
          deleteOnHit: false
        }
      },
      {
        desc: 'handles deleteOnHit=true',
        metatileCache: {
          deleteOnHit: true
        },
        expected: {
          ttl: 0,
          deleteOnHit: true
        }
      },
      {
        desc: 'handles deleteOnHit="true"',
        metatileCache: {
          deleteOnHit: 'true'
        },
        expected: {
          ttl: 0,
          deleteOnHit: true
        }
      },
      {
        desc: 'handles deleteOnHit and ttl',
        metatileCache: {
          ttl: 1000,
          deleteOnHit: true
        },
        expected: {
          ttl: 1000,
          deleteOnHit: true
        }
      }
    ]

    scenarios.forEach(function (scenario) {
      it(scenario.desc, function () {
        const uri = normalizeURI(makeUri(scenario.metatileCache))

        assert.ok(uri.query.metatileCache)
        assert.strictEqual(uri.query.metatileCache.ttl, scenario.expected.ttl)
        assert.strictEqual(uri.query.metatileCache.deleteOnHit, scenario.expected.deleteOnHit)
      })
    })
  })

  describe('metrics', function () {
    function makeUri (metrics) {
      const uri = {
        protocol: 'mapnik:',
        xml: fs.readFileSync('./test/raster/data/test.xml', 'utf8'),
        base: './test/raster/data/',
        query: { }
      }

      if (metrics !== undefined) {
        uri.query.metrics = metrics
      }

      return uri
    }

    it('Defaults to false', function () {
      const uri = normalizeURI(makeUri())
      assert(uri.query.metrics === false)
    })

    it('Set to false', function () {
      const uri = normalizeURI(makeUri(false))
      assert(uri.query.metrics === false)
    })

    it('Set to true', function () {
      const uri = normalizeURI(makeUri(true))
      assert(uri.query.metrics === true)
    })
  })
})
