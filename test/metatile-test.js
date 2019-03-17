const assert = require('assert')
const Metatile = require('../src/metatile')

const FULL = 20037508.342789244
const HALF = 0
// const QUAD = 10018754.171394622
// const QUADX = 10018754.17139462

describe('metatile (size = 1)', function () {
  beforeEach(function () {
    this.metatile = new Metatile({ size: 1 })
  })

  describe('zoom = 0', function () {
    describe('.first()', function () {
      it('.first({ x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 0, 0, 0 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, { x: 0, y: 0 })
      })
    })

    describe('.tiles()', function () {
      it('.tiles({ z: 0, x: 0, y: 0 })', function () {
        const [ z, x, y, xOffsetInPixels, yOffsetInPixels ] = [ 0, 0, 0, 0, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [{ z, x, y, xOffsetInPixels, yOffsetInPixels }])
      })
    })

    describe('.boundingBox()', function () {
      it('.boundingBox({ z: 0, x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 0, 0, 0 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -FULL, -FULL, FULL, FULL ])
      })
    })
  })

  describe('zoom = 1', function () {
    describe('.first()', function () {
      it('.first({ x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 0, 0 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, { x: 0, y: 0 })
      })

      it('.first({ x: 1, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 1, 0 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, { x: 1, y: 0 })
      })

      it('.first({ x: 0, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 0, 1 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, { x: 0, y: 1 })
      })

      it('.first({ x: 1, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 1, 1 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, { x: 1, y: 1 })
      })
    })

    describe('.tiles()', function () {
      it('.tiles({ z: 1, x: 0, y: 0 })', function () {
        const [ z, x, y, xOffsetInPixels, yOffsetInPixels ] = [ 1, 0, 0, 0, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [{ z, x, y, xOffsetInPixels, yOffsetInPixels }])
      })

      it('.tiles({ z: 1, x: 1, y: 0 })', function () {
        const [ z, x, y, xOffsetInPixels, yOffsetInPixels ] = [ 1, 1, 0, 0, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [{ z, x, y, xOffsetInPixels, yOffsetInPixels }])
      })

      it('.tiles({ z: 1, x: 0, y: 1 })', function () {
        const [ z, x, y, xOffsetInPixels, yOffsetInPixels ] = [ 1, 0, 1, 0, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [{ z, x, y, xOffsetInPixels, yOffsetInPixels }])
      })

      it('.tiles({ z: 1, x: 1, y: 1 })', function () {
        const [ z, x, y, xOffsetInPixels, yOffsetInPixels ] = [ 1, 1, 1, 0, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [{ z, x, y, xOffsetInPixels, yOffsetInPixels }])
      })
    })

    describe('.boundingBox()', function () {
      it('.boundingBox({ z: 1, x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 0, 0 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -FULL, HALF, HALF, FULL ])
      })

      it('.boundingBox({ z: 1, x: 1, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 1, 0 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ HALF, HALF, FULL, FULL ])
      })

      it('.boundingBox({ z: 1, x: 0, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 0, 1 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -FULL, -FULL, HALF, HALF ])
      })

      it('.boundingBox({ z: 1, x: 1, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 1, 1 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ HALF, -FULL, FULL, HALF ])
      })
    })
  })
})

describe('metatile (size = 4)', function () {
  beforeEach(function () {
    this.metatile = new Metatile({ size: 4 })
  })

  describe('zoom = 0', function () {
    describe('.first()', function () {
      const quadrant0 = { x: 0, y: 0 }

      it('.first({ x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 0, 0, 0 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant0)
      })
    })

    describe('.tiles()', function () {
      it('.tiles({ z: 0, x: 0, y: 0 })', function () {
        const [ z, x, y, xOffsetInPixels, yOffsetInPixels ] = [ 0, 0, 0, 0, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [{ z, x, y, xOffsetInPixels, yOffsetInPixels }])
      })
    })

    describe('.boundingBox()', function () {
      it('.boundingBox({ z: 0, x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 0, 0, 0 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -FULL, -FULL, FULL, FULL ])
      })
    })
  })

  describe('zoom = 1', function () {
    describe('.first()', function () {
      const quadrant0 = { x: 0, y: 0 }

      it('.first({ x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 0, 0 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant0)
      })

      it('.first({ x: 1, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 1, 0 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant0)
      })

      it('.first({ x: 0, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 0, 1 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant0)
      })

      it('.first({ x: 1, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 1, 1 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant0)
      })
    })

    describe('.tiles()', function () {
      it('.tiles({ z: 1, x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 0, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 1, x: 0, y: 0, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 1, x: 0, y: 1, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 1, x: 1, y: 0, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 1, x: 1, y: 1, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 1, x: 1, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 1, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 1, x: 0, y: 0, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 1, x: 0, y: 1, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 1, x: 1, y: 0, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 1, x: 1, y: 1, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 1, x: 0, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 0, 1 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 1, x: 0, y: 0, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 1, x: 0, y: 1, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 1, x: 1, y: 0, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 1, x: 1, y: 1, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 1, x: 1, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 1, 1 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 1, x: 0, y: 0, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 1, x: 0, y: 1, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 1, x: 1, y: 0, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 1, x: 1, y: 1, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })
    })

    describe('.boundingBox()', function () {
      it('.boundingBox({ z: 1, x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 0, 0 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -FULL, -FULL, FULL, FULL ])
      })

      it('.boundingBox({ z: 1, x: 1, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 1, 0 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -FULL, -FULL, FULL, FULL ])
      })

      it('.boundingBox({ z: 1, x: 0, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 0, 1 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -FULL, -FULL, FULL, FULL ])
      })

      it('.boundingBox({ z: 1, x: 1, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 1, 1 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -FULL, -FULL, FULL, FULL ])
      })
    })
  })

  describe('zoom = 2', function () {
    describe('.first()', function () {
      const quadrant1 = { x: 2, y: 0 }

      it('.first({ x: 2, y: 0 })', function () {
        const [ z, x, y ] = [ 2, 2, 0 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant1)
      })

      it('.first({ x: 3, y: 0 })', function () {
        const [ z, x, y ] = [ 2, 3, 0 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant1)
      })

      it('.first({ x: 2, y: 1 })', function () {
        const [ z, x, y ] = [ 2, 2, 1 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant1)
      })

      it('.first({ x: 3, y: 1 })', function () {
        const [ z, x, y ] = [ 2, 3, 1 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant1)
      })

      const quadrant2 = { x: 0, y: 2 }

      it('.first({ x: 0, y: 2 })', function () {
        const [ z, x, y ] = [ 2, 0, 2 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant2)
      })

      it('.first({ x: 1, y: 2 })', function () {
        const [ z, x, y ] = [ 2, 1, 2 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant2)
      })

      it('.first({ x: 0, y: 3 })', function () {
        const [ z, x, y ] = [ 2, 0, 3 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant2)
      })

      it('.first({ x: 1, y: 3 })', function () {
        const [ z, x, y ] = [ 2, 1, 3 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant2)
      })

      const quadrant3 = { x: 2, y: 2 }

      it('.first({ x: 2, y: 2 })', function () {
        const [ z, x, y ] = [ 2, 2, 2 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant3)
      })

      it('.first({ x: 3, y: 2 })', function () {
        const [ z, x, y ] = [ 2, 3, 2 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant3)
      })

      it('.first({ x: 2, y: 3 })', function () {
        const [ z, x, y ] = [ 2, 2, 3 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant3)
      })

      it('.first({ x: 3, y: 3 })', function () {
        const [ z, x, y ] = [ 2, 3, 3 ]

        const tile = this.metatile.first({ z, x, y })

        assert.deepEqual(tile, quadrant3)
      })
    })

    describe('.tiles()', function () {
      it('.tiles({ z: 2, x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 2, 0, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 0, y: 0, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 2, x: 0, y: 1, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 2, x: 1, y: 0, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 2, x: 1, y: 1, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 2, x: 1, y: 0 })', function () {
        const [ z, x, y ] = [ 2, 1, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 0, y: 0, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 2, x: 0, y: 1, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 2, x: 1, y: 0, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 2, x: 1, y: 1, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 2, x: 0, y: 1 })', function () {
        const [ z, x, y ] = [ 2, 0, 1 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 0, y: 0, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 2, x: 0, y: 1, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 2, x: 1, y: 0, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 2, x: 1, y: 1, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 2, x: 1, y: 1 })', function () {
        const [ z, x, y ] = [ 2, 1, 1 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 0, y: 0, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 2, x: 0, y: 1, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 2, x: 1, y: 0, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 2, x: 1, y: 1, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 2, x: 2, y: 0 })', function () {
        const [ z, x, y ] = [ 2, 2, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 2, y: 0, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 2, x: 2, y: 1, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 2, x: 3, y: 0, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 2, x: 3, y: 1, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 2, x: 2, y: 1 })', function () {
        const [ z, x, y ] = [ 2, 2, 1 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 2, y: 0, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 2, x: 2, y: 1, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 2, x: 3, y: 0, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 2, x: 3, y: 1, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 2, x: 3, y: 0 })', function () {
        const [ z, x, y ] = [ 2, 3, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 2, y: 0, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 2, x: 2, y: 1, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 2, x: 3, y: 0, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 2, x: 3, y: 1, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 2, x: 3, y: 1 })', function () {
        const [ z, x, y ] = [ 2, 3, 1 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 2, y: 0, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 2, x: 2, y: 1, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 2, x: 3, y: 0, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 2, x: 3, y: 1, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 2, x: 0, y: 2 })', function () {
        const [ z, x, y ] = [ 2, 0, 2 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 0, y: 2, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 2, x: 0, y: 3, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 2, x: 1, y: 2, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 2, x: 1, y: 3, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 2, x: 1, y: 2 })', function () {
        const [ z, x, y ] = [ 2, 1, 2 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 0, y: 2, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 2, x: 0, y: 3, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 2, x: 1, y: 2, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 2, x: 1, y: 3, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 2, x: 0, y: 3 })', function () {
        const [ z, x, y ] = [ 2, 0, 3 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 0, y: 2, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 2, x: 0, y: 3, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 2, x: 1, y: 2, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 2, x: 1, y: 3, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 2, x: 1, y: 3 })', function () {
        const [ z, x, y ] = [ 2, 1, 3 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 0, y: 2, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 2, x: 0, y: 3, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 2, x: 1, y: 2, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 2, x: 1, y: 3, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 2, x: 2, y: 2 })', function () {
        const [ z, x, y ] = [ 2, 2, 2 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 2, y: 2, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 2, x: 2, y: 3, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 2, x: 3, y: 2, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 2, x: 3, y: 3, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 2, x: 2, y: 3 })', function () {
        const [ z, x, y ] = [ 2, 2, 3 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 2, y: 2, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 2, x: 2, y: 3, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 2, x: 3, y: 2, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 2, x: 3, y: 3, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 2, x: 3, y: 2 })', function () {
        const [ z, x, y ] = [ 2, 3, 2 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 2, y: 2, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 2, x: 2, y: 3, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 2, x: 3, y: 2, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 2, x: 3, y: 3, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })

      it('.tiles({ z: 2, x: 3, y: 3 })', function () {
        const [ z, x, y ] = [ 2, 3, 3 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 2, y: 2, xOffsetInPixels: 0, yOffsetInPixels: 0 },
          { z: 2, x: 2, y: 3, xOffsetInPixels: 0, yOffsetInPixels: 256 },
          { z: 2, x: 3, y: 2, xOffsetInPixels: 256, yOffsetInPixels: 0 },
          { z: 2, x: 3, y: 3, xOffsetInPixels: 256, yOffsetInPixels: 256 }
        ])
      })
    })

    describe('.boundingBox()', function () {
      it('.boundingBox({ z: 2, x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 2, 0, 0 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -FULL, HALF, HALF, FULL ])
      })

      it('.boundingBox({ z: 2, x: 1, y: 0 })', function () {
        const [ z, x, y ] = [ 2, 1, 0 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -FULL, HALF, HALF, FULL ])
      })

      it('.boundingBox({ z: 2, x: 0, y: 1 })', function () {
        const [ z, x, y ] = [ 2, 0, 1 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -FULL, HALF, HALF, FULL ])
      })

      it('.boundingBox({ z: 2, x: 1, y: 1 })', function () {
        const [ z, x, y ] = [ 2, 1, 1 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -FULL, HALF, HALF, FULL ])
      })

      it('.boundingBox({ z: 2, x: 2, y: 0 })', function () {
        const [ z, x, y ] = [ 2, 2, 0 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ HALF, HALF, FULL, FULL ])
      })

      it('.boundingBox({ z: 2, x: 3, y: 0 })', function () {
        const [ z, x, y ] = [ 2, 3, 0 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ HALF, HALF, FULL, FULL ])
      })

      it('.boundingBox({ z: 2, x: 2, y: 1 })', function () {
        const [ z, x, y ] = [ 2, 2, 1 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ HALF, HALF, FULL, FULL ])
      })

      it('.boundingBox({ z: 2, x: 3, y: 1 })', function () {
        const [ z, x, y ] = [ 2, 3, 1 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ HALF, HALF, FULL, FULL ])
      })

      it('.boundingBox({ z: 2, x: 0, y: 2 })', function () {
        const [ z, x, y ] = [ 2, 0, 2 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -FULL, -FULL, HALF, HALF ])
      })

      it('.boundingBox({ z: 2, x: 1, y: 2 })', function () {
        const [ z, x, y ] = [ 2, 1, 2 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -FULL, -FULL, HALF, HALF ])
      })

      it('.boundingBox({ z: 2, x: 0, y: 3 })', function () {
        const [ z, x, y ] = [ 2, 0, 3 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -FULL, -FULL, HALF, HALF ])
      })

      it('.boundingBox({ z: 2, x: 1, y: 3 })', function () {
        const [ z, x, y ] = [ 2, 1, 3 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -FULL, -FULL, HALF, HALF ])
      })

      it('.boundingBox({ z: 2, x: 2, y: 2 })', function () {
        const [ z, x, y ] = [ 2, 2, 2 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ HALF, -FULL, FULL, HALF ])
      })

      it('.boundingBox({ z: 2, x: 3, y: 2 })', function () {
        const [ z, x, y ] = [ 2, 3, 2 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ HALF, -FULL, FULL, HALF ])
      })

      it('.boundingBox({ z: 2, x: 2, y: 3 })', function () {
        const [ z, x, y ] = [ 2, 2, 3 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ HALF, -FULL, FULL, HALF ])
      })

      it('.boundingBox({ z: 2, x: 3, y: 3 })', function () {
        const [ z, x, y ] = [ 2, 3, 3 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ HALF, -FULL, FULL, HALF ])
      })
    })
  })
})
