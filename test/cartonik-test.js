import assert from 'assert'
import Cartonik from '../src'

const EMPTY_POINT_MAP_XML = `<Map><Style name="points"><Rule><PointSymbolizer/></Rule></Style></Map>`

describe('cartonik', function () {
  describe('metatile = 1', function () {
    beforeEach(function () {
      this.cartonik = Cartonik.create()
    })

    it('.tiles({ xml, coords: { z: 0, x: 0, y: 0 }, format: \'wadus\' })', async function () {
      const xml = EMPTY_POINT_MAP_XML

      try {
        await this.cartonik.tiles({ xml, coords: { z: 0, x: 0, y: 0 }, format: 'wadus' })
      } catch (error) {
        assert.ok(error instanceof TypeError)
        assert.equal(error.message, 'Format \'wadus\' not allowed')
      }
    })

    describe('zoom = 0', function () {
      it('.tiles({ xml, coords: { z: 0, x: 0, y: 0 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 0, 0, 0 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['0/0/0'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })
    })

    describe('zoom = 1', function () {
      it('.tiles({ xml, coords: { z: 1, x: 0, y: 0 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 1, 0, 0 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['1/0/0'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 1, x: 1, y: 0 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 1, 1, 0 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['1/1/0'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 1, x: 0, y: 1 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 1, 0, 1 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['1/0/1'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 1, x: 1, y: 1 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 1, 1, 1 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['1/1/1'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })
    })
  })

  describe('metatile = 4', function () {
    beforeEach(function () {
      this.cartonik = Cartonik.create({ metatile: 4 })
    })

    it('.tiles({ xml, coords: { z: 0, x: 0, y: 0 }, format: \'wadus\' })', async function () {
      const xml = EMPTY_POINT_MAP_XML

      try {
        await this.cartonik.tiles({ xml, coords: { z: 0, x: 0, y: 0 }, format: 'wadus' })
      } catch (error) {
        assert.ok(error instanceof TypeError)
        assert.equal(error.message, 'Format \'wadus\' not allowed')
      }
    })

    describe('zoom = 0', function () {
      it('.tiles({ xml, coords: { z: 0, x: 0, y: 0 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 0, 0, 0 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['0/0/0'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })
    })

    describe('zoom = 1', function () {
      it('.tiles({ xml, coords: { z: 1, x: 0, y: 0 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 1, 0, 0 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['1/0/0', '1/0/1', '1/1/0', '1/1/1'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 1, x: 1, y: 0 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 1, 1, 0 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['1/0/0', '1/0/1', '1/1/0', '1/1/1'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 1, x: 0, y: 1 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 1, 0, 1 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['1/0/0', '1/0/1', '1/1/0', '1/1/1'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 1, x: 1, y: 1 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 1, 1, 1 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['1/0/0', '1/0/1', '1/1/0', '1/1/1'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })
    })

    describe('zoom = 2', function () {
      it('.tiles({ xml, coords: { z: 2, x: 0, y: 0 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 2, 0, 0 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['2/0/0', '2/0/1', '2/1/0', '2/1/1'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 0 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 2, 1, 0 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['2/0/0', '2/0/1', '2/1/0', '2/1/1'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 2, x: 0, y: 1 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 2, 0, 1 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['2/0/0', '2/0/1', '2/1/0', '2/1/1'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 1 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 2, 1, 1 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['2/0/0', '2/0/1', '2/1/0', '2/1/1'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 0 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 2, 2, 0 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['2/2/0', '2/2/1', '2/3/0', '2/3/1'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 1 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 2, 2, 1 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['2/2/0', '2/2/1', '2/3/0', '2/3/1'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 2, x: 0, y: 2 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 2, 0, 2 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['2/0/2', '2/0/3', '2/1/2', '2/1/3'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 2 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 2, 3, 0 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['2/2/0', '2/2/1', '2/3/0', '2/3/1'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 2, x: 0, y: 3 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 2, 0, 3 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['2/0/2', '2/0/3', '2/1/2', '2/1/3'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 3 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 2, 1, 3 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['2/0/2', '2/0/3', '2/1/2', '2/1/3'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 2 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 2, 2, 2 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['2/2/2', '2/2/3', '2/3/2', '2/3/3'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 2 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 2, 3, 2 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['2/2/2', '2/2/3', '2/3/2', '2/3/3'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 3 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 2, 2, 3 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['2/2/2', '2/2/3', '2/3/2', '2/3/3'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 3 }, format: \'png\' })', async function () {
        const [ z, x, y ] = [ 2, 3, 3 ]
        const coords = { z, x, y }
        const xml = EMPTY_POINT_MAP_XML
        const format = 'png'

        const tiles = await this.cartonik.tiles({ xml, coords, format })

        assert.deepEqual(Object.keys(tiles), ['2/2/2', '2/2/3', '2/3/2', '2/3/3'])
        Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
      })
    })
  })
})
