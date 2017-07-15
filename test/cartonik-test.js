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

  it('.load() should throw an error', async function () {
    try {
      await this.cartonik.load({ path: null })
    } catch (error) {
      assert.ok(error instanceof Error)
    }
  })

  it('.render() should throw an error', async function () {
    try {
      await this.cartonik.render({ map: null })
    } catch (error) {
      assert.ok(error instanceof Error)
    }
  })

  it('.encode() should throw an error', async function () {
    try {
      await this.cartonik.encode({ image: null, encoding: null })
    } catch (error) {
      assert.ok(error instanceof Error)
    }
  })
})
