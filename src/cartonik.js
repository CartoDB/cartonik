import Metatile from './metatile'
import MapRenderer from './map-renderer'

const TILE_SIZE = 256
const ALLOWED_ENCODINGS = {
  png: true
}

export default class Cartonik {
  static create ({ metatile: size } = {}) {
    const metatile = new Metatile({ size })
    const mapRenderer = new MapRenderer()

    return new Cartonik({ mapRenderer, metatile })
  }

  constructor ({ mapRenderer, metatile }) {
    this.mapRenderer = mapRenderer
    this.metatile = metatile
  }

  async tiles ({ xml, coords, format: encoding } = {}) {
    if (!ALLOWED_ENCODINGS[encoding]) {
      throw new TypeError(`Format '${encoding}' not allowed`)
    }

    const { z } = coords
    const map = await this.mapRenderer.load({ xml })

    map.extent = this.metatile.boundingBox(coords)

    const dimensions = this.metatile.dimensions({ z })
    const image = await this.mapRenderer.render({ map, dimensions })
    const metatiles = this.metatile.tiles(coords)

    const tiles = await Promise.all(metatiles.map(({ z, x, y }) => {
      const { x: xFirst, y: yFirst } = this.metatile.first({ z, x, y })
      const coords = {
        x: (x - xFirst) * TILE_SIZE,
        y: (y - yFirst) * TILE_SIZE
      }

      return this.mapRenderer.slice({ image, coords, encoding })
    }))

    const result = {}

    for (let [ index, { z, x, y } ] of metatiles.entries()) {
      result[`${z}/${x}/${y}`] = tiles[index]
    }

    return result
  }
}
