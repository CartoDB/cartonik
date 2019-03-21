'use strict'

const vectorRendererFactory = require('../../lib/vector')
const assert = require('assert')
const { it } = require('mocha')
const path = require('path')
const fs = require('fs')

it('should timeout on close', function (done) {
  this.timeout(6000)

  const xml = fs.readFileSync(path.resolve(path.join(__dirname, '/test-a.xml')), 'utf8')

  vectorRendererFactory({ xml: xml, base: path.join(__dirname, '/') }, function (err, source) {
    assert.ifError(err)
    assert.ok(source)

    source._mapPool.acquire(function (err, map) {
      assert.ifError(err)
      assert.ok(map, 'acquires map')
    })

    source.close(function (err) {
      assert.strictEqual(err.message, 'Source resource pool drain timed out after 5s')
      done()
    })
  })
})
