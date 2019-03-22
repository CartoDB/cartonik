const assert = require('assert')
const { describe, it } = require('mocha')
const defaults = require('../lib/defaults')
const fs = require('fs')

describe('default options', function () {
  describe('metatileCache config', function () {
    function makeOptions (metatileCache) {
      return {
        metatileCache: metatileCache
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
        const uri = defaults(makeOptions(scenario.metatileCache))

        assert.ok(uri.metatileCache)
        assert.strictEqual(uri.metatileCache.ttl, scenario.expected.ttl)
        assert.strictEqual(uri.metatileCache.deleteOnHit, scenario.expected.deleteOnHit)
      })
    })
  })

  describe('metrics', function () {
    function makeOptions (metrics) {
      const uri = {
        protocol: 'mapnik:',
        xml: fs.readFileSync('./test/raster/data/test.xml', 'utf8'),
        base: './test/raster/data/'
      }

      if (metrics !== undefined) {
        uri.metrics = metrics
      }

      return uri
    }

    it('Defaults to false', function () {
      const uri = defaults(makeOptions())
      assert(uri.metrics === false)
    })

    it('Set to false', function () {
      const uri = defaults(makeOptions(false))
      assert(uri.metrics === false)
    })

    it('Set to true', function () {
      const uri = defaults(makeOptions(true))
      assert(uri.metrics === true)
    })
  })
})
