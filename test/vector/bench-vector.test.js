'use strict'

const vectorRendererFactory = require('../../lib/vector-renderer')
const mapnik = require('@carto/mapnik')
const path = require('path')
const fs = require('fs')
const queue = require('queue-async')
const assert = require('assert')
const { describe, it, before } = require('mocha')

const suites = [
  {
    threadingMode: '',
    uri: {
      xml: fs.readFileSync(path.resolve(path.join(__dirname, '/bench-test.xml')), 'utf8'),
      base: path.join(__dirname, '/'),
      blank: false
    }
  },
  {
    threadingMode: 'auto',
    uri: {
      xml: fs.readFileSync(path.resolve(path.join(__dirname, '/bench-test-auto.xml')), 'utf8'),
      base: path.join(__dirname, '/'),
      blank: false
    }
  },
  {
    threadingMode: 'async',
    uri: {
      xml: fs.readFileSync(path.resolve(path.join(__dirname, '/bench-test-async.xml')), 'utf8'),
      base: path.join(__dirname, '/'),
      blank: false
    }
  }
]

suites.forEach(function ({ threadingMode, uri }) {
  describe(`vector benchmark`, function () {
    this.timeout(5000)
    let renderer
    let rateDeferred

    before('setup', function (done) {
      renderer = vectorRendererFactory(uri)
      renderer.getTile('mvt', 0, 0, 0)
        .then(() => done())
        .catch((err) => done(err))
    })

    it(`theading mode: ${threadingMode}`, function (done) {
      var time = +(new Date())
      var total = 0
      var empty = 0
      var q = queue(1)

      for (var z = 0; z < 5; z++) {
        for (var x = 0; x < Math.pow(2, z); x++) {
          for (var y = 0; y < Math.pow(2, z); y++) {
            q.defer(getTile, z, x, y)
            total++
          }
        }
      }

      function getTile (z, x, y, callback) {
        renderer.getTile('mvt', z, x, y)
          .then(({ tile: buffer }) => {
            if (!buffer.length) {
              empty++
              return callback(null, buffer)
            }
            var vtile = new mapnik.VectorTile(z, x, y)
            vtile.setData(buffer, function (err) {
              assert.ifError(err, z + '/' + x + '/' + y)
              callback(null, buffer)
            })
          })
          .catch((err) => callback(err))
      }

      q.awaitAll(function (err, res) {
        if (err) {
          return done(err)
        }

        renderer.close()
          .then(() => {
            time = +(new Date()) - time
            rateDeferred = total / (time / 1000)
            // only assert on rate for release builds
            if (process.env.NPM_FLAGS && process.env.NPM_FLAGS.indexOf('--debug') > -1) {
              console.log('Skipping rate assertion, since we are running in debug mode')
            } else {
              assert.strictEqual(rateDeferred > 20, true, 'render ' + total + ' tiles @ ' + rateDeferred.toFixed(1) + ' tiles/sec')
            }
            assert.strictEqual(total, 341)
            assert.strictEqual(empty, 73)
            done()
          })
          .catch((err) => done(err))
      })
    })
  })
})
