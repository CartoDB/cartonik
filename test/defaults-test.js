'use strict'

const assert = require('assert')
const { describe, it } = require('mocha')
const defaults = require('../lib/renderer/defaults')
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
        const options = defaults(makeOptions(scenario.metatileCache))

        assert.ok(options.metatileCache)
        assert.strictEqual(options.metatileCache.ttl, scenario.expected.ttl)
        assert.strictEqual(options.metatileCache.deleteOnHit, scenario.expected.deleteOnHit)
      })
    })
  })

  describe('metrics', function () {
    function makeOptions (metrics) {
      const options = {
        protocol: 'mapnik:',
        xml: fs.readFileSync('./test/fixtures/mmls/world-borders.xml', 'utf8'),
        base: './test/fixtures/datasources/shapefiles/world-borders/'
      }

      if (metrics !== undefined) {
        options.metrics = metrics
      }

      return options
    }

    it('defaults to false', function () {
      const options = defaults(makeOptions())
      assert(options.metrics === false)
    })

    it('set to false', function () {
      const options = defaults(makeOptions(false))
      assert(options.metrics === false)
    })

    it('set to true', function () {
      const options = defaults(makeOptions(true))
      assert(options.metrics === true)
    })
  })
})
