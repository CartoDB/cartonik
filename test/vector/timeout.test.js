'use strict'

const vectorRendererFactory = require('../../lib/vector-renderer')
const path = require('path')
const fs = require('fs')
const assert = require('assert')
const { it } = require('mocha')

const sources = {
  a: {
    xml: fs.readFileSync(path.resolve(path.join(__dirname, '/test-c.xml')), 'utf8'),
    base: path.join(__dirname, '/'),
    query: {
      bufferSize: 64,
      limits: {
        render: 1
      }
    }
  }
}

const tests = {
  a: [{ coords: '2.1.1', timeout: 1 }]
}

Object.keys(tests).forEach(function (source) {
  it('setup', function (done) {
    sources[source] = vectorRendererFactory(sources[source], function (err) {
      assert.ifError(err)
      done()
    })
  })
})

Object.keys(tests).forEach(function (source) {
  tests[source].forEach(function (test) {
    var coords = test.coords.split('.')
    var timeout = test.timeout
    var z = coords[0]
    var x = coords[1]
    var y = coords[2]
    it('should timeout ' + source + ' (' + test.coords + ') using limits.render ' + timeout, function (done) {
      sources[source].getTile(z, x, y, function (err, buffer, headers) {
        assert.ok(err)
        assert.strictEqual(err.message, 'Render timed out')
        done()
      })
    })
  })
})

Object.keys(tests).forEach(function (source) {
  it('teardown', function (done) {
    var s = sources[source]
    assert.strictEqual(1, s._mapPool.size)
    s.close(function () {
      assert.strictEqual(0, s._mapPool.size)
      done()
    })
  })
})
