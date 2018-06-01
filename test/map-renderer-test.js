import assert from 'assert'
import { Map } from 'mapnik'
import MapRenderer from '../src/map-renderer'
import Metatile from '../src/metatile'

describe('map-renderer', function () {
  beforeEach(function () {
    const metatile = new Metatile()
    this.mapRenderer = new MapRenderer({ metatile })
  })

  it('.load({ xml: null }) should throw an error', async function () {
    try {
      await this.mapRenderer.load({ xml: null })
    } catch (error) {
      assert.ok(error instanceof Error)
      assert.equal(error.message, `Bad argument: 'xml' should be a non empty string`)
    }
  })

  it('.load({ xml }) should load a map', async function () {
    const xml = `<Map><Style name="points"><Rule><PointSymbolizer/></Rule></Style></Map>`
    const map = await this.mapRenderer.load({ xml })

    assert.ok(map instanceof Map)
    assert.equal(map.height, 256)
    assert.equal(map.width, 256)
  })
})
