import assert from 'assert'
import Cartonik from '../src'

describe('cartonik metatile = 1', function () {
  beforeEach(function () {
    this.cartonik = Cartonik.create()
  })

  it('.tile({ xml, coords: { z: 0, x: 0, y: 0 }, format: \'png\' })', async function () {
    const [ z, x, y ] = [ 0, 0, 0 ]
    const coords = { z, x, y }
    const xml = `<Map><Style name="points"><Rule><PointSymbolizer/></Rule></Style></Map>`
    const format = 'png'

    const tiles = await this.cartonik.tile({ xml, coords, format })

    assert.deepEqual(Object.keys(tiles), ['0/0/0'])
    Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
  })

  it('.tile({ xml, coords: { z: 1, x: 1, y: 1 }, format: \'png\' })', async function () {
    const [ z, x, y ] = [ 1, 1, 1 ]
    const coords = { z, x, y }
    const xml = `<Map><Style name="points"><Rule><PointSymbolizer/></Rule></Style></Map>`
    const format = 'png'

    const tiles = await this.cartonik.tile({ xml, coords, format })

    assert.deepEqual(Object.keys(tiles), ['1/1/1'])
    Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
  })

  it('.tile({ xml, coords: { z: 0, x: 0, y: 0 }, format: \'wadus\' })', async function () {
    const xml = `<Map><Style name="points"><Rule><PointSymbolizer/></Rule></Style></Map>`
    try {
      await this.cartonik.tile({ xml, coords: { z: 0, x: 0, y: 0 }, format: 'wadus' })
    } catch (error) {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'Format \'wadus\' not allowed')
    }
  })
})

describe('cartonik metatile = 4', function () {
  beforeEach(function () {
    this.cartonik = Cartonik.create({ metatile: 4 })
  })

  it('.tile(0/0/0) should return a valid tile', async function () {
    const [ z, x, y ] = [ 0, 0, 0 ]
    const coords = { z, x, y }
    const xml = `<Map><Style name="points"><Rule><PointSymbolizer/></Rule></Style></Map>`
    const format = 'png'

    const tiles = await this.cartonik.tile({ xml, coords, format })

    assert.deepEqual(Object.keys(tiles), ['0/0/0'])
    Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
  })

  it('.tile(1/1/1) should return a valid tile', async function () {
    const [ z, x, y ] = [ 1, 1, 1 ]
    const coords = { z, x, y }
    const xml = `<Map><Style name="points"><Rule><PointSymbolizer/></Rule></Style></Map>`
    const format = 'png'

    const tiles = await this.cartonik.tile({ xml, coords, format })

    assert.deepEqual(Object.keys(tiles), ['1/0/0', '1/0/1', '1/1/0', '1/1/1'])
    Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
  })

  it('.tile(1/1/1) should return a valid tile', async function () {
    const [ z, x, y ] = [ 1, 1, 1 ]
    const coords = { z, x, y }
    const xml = `<Map><Style name="points"><Rule><PointSymbolizer/></Rule></Style></Map>`
    const format = 'png'

    const tiles = await this.cartonik.tile({ xml, coords, format })

    assert.deepEqual(Object.keys(tiles), ['1/0/0', '1/0/1', '1/1/0', '1/1/1'])
    Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))
  })
})
