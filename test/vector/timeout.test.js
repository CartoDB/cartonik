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
    bufferSize: 64,
    limits: {
      render: 1
    }
  }
}

const tests = {
  a: [{ coords: '2.1.1', timeout: 1 }]
}

Object.keys(tests).forEach(function (source) {
  it('setup', function () {
    sources[source] = vectorRendererFactory(sources[source])
  })
})

Object.keys(tests).forEach(function (source) {
  tests[source].forEach(function (test) {
    const coords = test.coords.split('.')
    const timeout = test.timeout
    const z = coords[0]
    const x = coords[1]
    const y = coords[2]
    it('should timeout ' + source + ' (' + test.coords + ') using limits.render ' + timeout, async function () {
      try {
        await sources[source].getTile('mvt', z, x, y)
        throw new Error('Should not throw this error')
      } catch (err) {
        assert.strictEqual(err.message, 'Render timed out')
      }
    })
  })
})

Object.keys(tests).forEach(function (source) {
  it('teardown', async function () {
    assert.strictEqual(1, sources[source]._mapPool.size)
    await sources[source].close()
    assert.strictEqual(0, sources[source]._mapPool.size)
  })
})
