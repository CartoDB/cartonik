import assert from 'assert'
import Metatile from '../src/metatile'

describe('metatile (size = 1)', function () {
  beforeEach(function () {
    this.metatile = new Metatile({ size: 1 })
  })

  describe('zoom = 0', function () {
    describe('.x0y0()', function () {
      it('.x0y0({ x: 0, y: 0 }) => { x: 0, y: 0 }', function () {
        const [ z, x, y ] = [ 0, 0, 0 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, { x0: 0, y0: 0 })
      })
    })

    describe('.tiles()', function () {
      it('.tiles({ z: 0, x: 0, y: 0 }) => [{ z: 0, x: 0, y: 0 }]', function () {
        const [ z, x, y ] = [ 0, 0, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [{ z, x, y }])
      })
    })

    describe('.boundingBox()', function () {
      it('.boundingBox({ z: 0, x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 0, 0, 0 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244 ])
      })
    })
  })

  describe('zoom = 1', function () {
    describe('.x0y0()', function () {
      it('.x0y0({ x: 0, y: 0 }) => { x: 0, y: 0 }', function () {
        const [ z, x, y ] = [ 1, 0, 0 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, { x0: 0, y0: 0 })
      })

      it('.x0y0({ x: 1, y: 0 }) => { x: 1, y: 0 }', function () {
        const [ z, x, y ] = [ 1, 1, 0 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, { x0: 1, y0: 0 })
      })

      it('.x0y0({ x: 0, y: 1 }) => { x: 0, y: 1 }', function () {
        const [ z, x, y ] = [ 1, 0, 1 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, { x0: 0, y0: 1 })
      })

      it('.x0y0({ x: 1, y: 1 }) => { x: 1, y: 1 }', function () {
        const [ z, x, y ] = [ 1, 1, 1 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, { x0: 1, y0: 1 })
      })
    })

    describe('.tiles()', function () {
      it('.tiles({ z: 1, x: 0, y: 0 }) => [{ z: 1, x: 0, y: 0 }]', function () {
        const [ z, x, y ] = [ 1, 0, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [{ z, x, y }])
      })

      it('.tiles({ z: 1, x: 1, y: 0 }) => [{ z: 1, x: 1, y: 0 }]', function () {
        const [ z, x, y ] = [ 1, 1, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [{ z, x, y }])
      })

      it('.tiles({ z: 1, x: 0, y: 1 }) => [{ z: 1, x: 0, y: 1 }]', function () {
        const [ z, x, y ] = [ 1, 0, 1 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [{ z, x, y }])
      })

      it('.tiles({ z: 1, x: 1, y: 1 }) => [{ z: 1, x: 1, y: 1 }]', function () {
        const [ z, x, y ] = [ 1, 1, 1 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [{ z, x, y }])
      })
    })

    describe('.boundingBox()', function () {
      it('.boundingBox({ z: 1, x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 0, 0 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -20037508.342789244, 0, 0, 20037508.342789244 ])
      })

      it('.boundingBox({ z: 1, x: 1, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 1, 0 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ 0, 0, 20037508.342789244, 20037508.342789244 ])
      })

      it('.boundingBox({ z: 1, x: 0, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 0, 1 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -20037508.342789244, -20037508.342789244, 0, 0 ])
      })

      it('.boundingBox({ z: 1, x: 1, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 1, 1 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ 0, -20037508.342789244, 20037508.342789244, 0 ])
      })
    })
  })
})

describe('metatile (size = 4)', function () {
  beforeEach(function () {
    this.metatile = new Metatile({ size: 4 })
  })

  describe('zoom = 0', function () {
    describe('.x0y0()', function () {
      const quadrant0 = { x0: 0, y0: 0 }

      it('.x0y0({ x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 0, 0, 0 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant0)
      })
    })

    describe('.tiles()', function () {
      it('.tiles({ z: 0, x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 0, 0, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [{ z: 0, x: 0, y: 0 }])
      })
    })

    describe('.boundingBox()', function () {
      it('.boundingBox({ z: 0, x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 0, 0, 0 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244 ])
      })
    })
  })

  describe('zoom = 1', function () {
    describe('.x0y0()', function () {
      const quadrant0 = { x0: 0, y0: 0 }

      it('.x0y0({ x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 0, 0 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant0)
      })

      it('.x0y0({ x: 1, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 1, 0 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant0)
      })

      it('.x0y0({ x: 0, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 0, 1 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant0)
      })

      it('.x0y0({ x: 1, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 1, 1 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant0)
      })
    })

    describe('.tiles()', function () {
      it('.tiles({ z: 1, x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 0, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 1, x: 0, y: 0 },
          { z: 1, x: 0, y: 1 },
          { z: 1, x: 1, y: 0 },
          { z: 1, x: 1, y: 1 }
        ])
      })

      it('.tiles({ z: 1, x: 1, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 1, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 1, x: 0, y: 0 },
          { z: 1, x: 0, y: 1 },
          { z: 1, x: 1, y: 0 },
          { z: 1, x: 1, y: 1 }
        ])
      })

      it('.tiles({ z: 1, x: 0, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 0, 1 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 1, x: 0, y: 0 },
          { z: 1, x: 0, y: 1 },
          { z: 1, x: 1, y: 0 },
          { z: 1, x: 1, y: 1 }
        ])
      })

      it('.tiles({ z: 1, x: 1, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 1, 1 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 1, x: 0, y: 0 },
          { z: 1, x: 0, y: 1 },
          { z: 1, x: 1, y: 0 },
          { z: 1, x: 1, y: 1 }
        ])
      })
    })

    describe('.boundingBox()', function () {
      it('.boundingBox({ z: 1, x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 0, 0 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244 ])
      })

      it('.boundingBox({ z: 1, x: 1, y: 0 })', function () {
        const [ z, x, y ] = [ 1, 1, 0 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ 0, -20037508.342789244, 20037508.342789244, 20037508.342789244 ])
      })

      it('.boundingBox({ z: 1, x: 0, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 0, 1 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ -20037508.342789244, -20037508.342789244, 20037508.342789244, 0 ])
      })

      it('.boundingBox({ z: 1, x: 1, y: 1 })', function () {
        const [ z, x, y ] = [ 1, 1, 1 ]

        const bbox = this.metatile.boundingBox({ z, x, y })

        assert.deepEqual(bbox, [ 0, -20037508.342789244, 20037508.342789244, 0 ])
      })
    })
  })

  describe('zoom = 2', function () {
    describe('.x0y0()', function () {
      const quadrant1 = { x0: 2, y0: 0 }

      it('.x0y0({ x: 2, y: 0 })', function () {
        const [ z, x, y ] = [ 2, 2, 0 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant1)
      })

      it('.x0y0({ x: 3, y: 0 })', function () {
        const [ z, x, y ] = [ 2, 3, 0 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant1)
      })

      it('.x0y0({ x: 2, y: 1 })', function () {
        const [ z, x, y ] = [ 2, 2, 1 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant1)
      })

      it('.x0y0({ x: 3, y: 1 })', function () {
        const [ z, x, y ] = [ 2, 3, 1 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant1)
      })

      const quadrant2 = { x0: 0, y0: 2 }

      it('.x0y0({ x: 0, y: 2 })', function () {
        const [ z, x, y ] = [ 2, 0, 2 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant2)
      })

      it('.x0y0({ x: 1, y: 2 })', function () {
        const [ z, x, y ] = [ 2, 1, 2 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant2)
      })

      it('.x0y0({ x: 0, y: 3 })', function () {
        const [ z, x, y ] = [ 2, 0, 3 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant2)
      })

      it('.x0y0({ x: 1, y: 3 })', function () {
        const [ z, x, y ] = [ 2, 1, 3 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant2)
      })

      const quadrant3 = { x0: 2, y0: 2 }

      it('.x0y0({ x: 2, y: 2 })', function () {
        const [ z, x, y ] = [ 2, 2, 2 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant3)
      })

      it('.x0y0({ x: 3, y: 2 })', function () {
        const [ z, x, y ] = [ 2, 3, 2 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant3)
      })

      it('.x0y0({ x: 2, y: 3 })', function () {
        const [ z, x, y ] = [ 2, 2, 3 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant3)
      })

      it('.x0y0({ x: 3, y: 3 })', function () {
        const [ z, x, y ] = [ 2, 3, 3 ]

        const { x0, y0 } = this.metatile.x0y0({ z, x, y })

        assert.deepEqual({ x0, y0 }, quadrant3)
      })
    })

    describe('.tiles()', function () {
      it('.tiles({ z: 2, x: 0, y: 0 })', function () {
        const [ z, x, y ] = [ 2, 0, 0 ]

        const tiles = this.metatile.tiles({ z, x, y })

        assert.deepEqual(tiles, [
          { z: 2, x: 0, y: 0 },
          { z: 2, x: 0, y: 1 },
          { z: 2, x: 1, y: 0 },
          { z: 2, x: 1, y: 1 }
        ])
      })
    })
  })
})
