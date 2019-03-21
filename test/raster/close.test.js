'use strict'

const fs = require('fs')
const assert = require('assert')
const { describe, it } = require('mocha')
const rasterRendererFactory = require('../../lib/raster-renderer')

describe('Closing behavior ', function () {
  it('should close cleanly 1', function (done) {
    rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/world.xml', 'utf8'), base: './test/raster/data/' }, function (err, source) {
      assert.ifError(err)
      assert.strictEqual(source._open, true)
      source.close(function (err) {
        assert.ifError(err)
        assert.strictEqual(source._open, false)
        done()
      })
    })
  })

  it('should close cleanly 2', function (done) {
    rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/world.xml', 'utf8'), base: './test/raster/data/' }, function (err, source) {
      assert.ifError(err)
      assert.strictEqual(source._open, true)
      source.getTile(0, 0, 0, function (err) {
        assert.ifError(err)
        assert.strictEqual(source._open, true)
        // now close the source
        source.close(function (err) {
          assert.ifError(err)
          assert.strictEqual(source._open, false)
          done()
        })
      })
    })
  })

  it('should throw with invalid usage (close before getTile)', function (done) {
    rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/world.xml', 'utf8'), base: './test/raster/data/' }, function (err, source) {
      if (err) throw err
      // now close the source
      // now that the pool is draining further
      // access to the source is invalid and should throw
      source.close(function (err) {
        assert.ifError(err)
        // pool will be draining...
      })
      source.getTile(0, 0, 0, function (err, info, headers) {
        assert.strictEqual(err.message, 'pool is draining and cannot accept work')
        done()
      })
    })
  })

  it('should throw with invalid usage (close after getTile)', function (done) {
    rasterRendererFactory({ xml: fs.readFileSync('./test/raster/data/world.xml', 'utf8'), base: './test/raster/data/' }, function (err, source) {
      if (err) throw err
      source.getTile(0, 0, 0, function (err, info, headers) {
        assert.ifError(err)
        // now close the source
        source.close(function (err) {
          assert.ifError(err)
          // pool will be draining...
        })
        // now that the pool is draining further
        // access to the source is invalid and should throw
        source.getTile(0, 0, 0, function (err, info, headers) {
          assert.strictEqual(err.message, 'pool is draining and cannot accept work')
          done()
        })
      })
    })
  })
})
