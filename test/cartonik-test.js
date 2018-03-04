import { Map } from 'mapnik'
import assert from 'assert'
import Cartonik from '../src'

describe('cartonik', function () {
  beforeEach(function () {
    this.cartonik = new Cartonik()
  })

  it('.extent() should calculate bounding box from coordinates 0/0/0', function () {
    const [ z, x, y ] = [ 0, 0, 0 ]

    const bbox = this.cartonik.extent({ z, x, y })

    assert.deepEqual(bbox, [ -20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244 ])
  })

  it('.load({ xml: null }) should throw an error', async function () {
    try {
      await this.cartonik.load({ xml: null })
    } catch (error) {
      assert.ok(error instanceof Error)
      assert.equal(error.message, `Bad argument: 'xml' should be a non empty string`)
    }
  })

  it('.load({ xml }) should load a map', async function () {
    const map = await this.cartonik.load({ xml: `<Map><Style name="points"><Rule><PointSymbolizer/></Rule></Style></Map>` })

    assert.ok(map instanceof Map)
    assert.equal(map.height, 256)
    assert.equal(map.width, 256)
  })

  it('.render() should throw TypeError', async function () {
    try {
      await this.cartonik.render({ map: null })
    } catch (error) {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'Cannot read property \'render\' of null')
    }
  })

  it('.encode() should throw an error', async function () {
    try {
      await this.cartonik.encode({ image: null, encoding: null })
    } catch (error) {
      assert.ok(error instanceof TypeError)
      assert.equal(error.message, 'Encoding \'null\' not allowed')
    }
  })
})
