import { Map } from 'mapnik'
import assert from 'assert'
import Cartonik from '../src'
import Metatile from '../src/metatile'

describe('cartonik', function () {
  beforeEach(function () {
    const metatile = this.metatile = new Metatile()
    this.cartonik = new Cartonik({ metatile })
  })

  it('.tile() should return a valid tile', async function () {
    const [ z, x, y ] = [ 0, 0, 0 ]
    const coords = { z, x, y }
    const xml = `<Map><Style name="points"><Rule><PointSymbolizer/></Rule></Style></Map>`
    const format = 'png'

    const tile = await this.cartonik.tile({ xml, coords, format })

    assert.ok(tile instanceof Buffer)
  })

  it('metatile.boundingBox() should calculate bounding box from coordinates 0/0/0', function () {
    const [ z, x, y ] = [ 0, 0, 0 ]

    const bbox = this.metatile.boundingBox({ z, x, y })

    assert.deepEqual(bbox, [ -20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244 ])
  })

  it('._load({ xml: null }) should throw an error', async function () {
    try {
      await this.cartonik._load({ xml: null })
    } catch (error) {
      assert.ok(error instanceof Error)
      assert.equal(error.message, `Bad argument: 'xml' should be a non empty string`)
    }
  })

  it('._load({ xml }) should load a map', async function () {
    const xml = `<Map><Style name="points"><Rule><PointSymbolizer/></Rule></Style></Map>`
    const map = await this.cartonik._load({ xml })

    assert.ok(map instanceof Map)
    assert.equal(map.height, 256)
    assert.equal(map.width, 256)
  })

  it('._render() should throw TypeError', async function () {
    try {
      await this.cartonik._render({ map: null, coords: { z: 0, x: 0, y: 0 } })
    } catch (error) {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'Cannot read property \'render\' of null')
    }
  })

  it('.tile() should throw an error', async function () {
    const xml = `<Map><Style name="points"><Rule><PointSymbolizer/></Rule></Style></Map>`
    try {
      await this.cartonik.tile({ xml, coords: { z: 0, x: 0, y: 0 }, format: 'wadus' })
    } catch (error) {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'Format \'wadus\' not allowed')
    }
  })
})
