import Metatile from './metatile'
import MapRenderer from './map-renderer'

const ALLOWED_ENCODINGS = {
  png: true
}

export default class Cartonik {
  static create ({ metatile: size } = {}) {
    const metatile = new Metatile({ size })
    const mapRenderer = new MapRenderer({ metatile })

    return new Cartonik({ mapRenderer, metatile })
  }

  constructor ({ mapRenderer, metatile }) {
    this.mapRenderer = mapRenderer
    this.metatile = metatile
  }

  async tile ({ xml, coords, format: encoding } = {}) {
    if (!ALLOWED_ENCODINGS[encoding]) {
      throw new TypeError(`Format '${encoding}' not allowed`)
    }

    const map = await this.mapRenderer.load({ xml })
    map.extent = this.metatile.boundingBox(coords)

    const image = await this.mapRenderer.render({ map, coords })

    const metatiles = this.metatile.tiles(coords)

    const tiles = await Promise.all(metatiles.map(({ z, x, y }) => {
      return this.mapRenderer.encode({ image, coords: { z, x, y }, encoding })
    }))

    const result = {}

    for (let [ index, { z, x, y } ] of metatiles.entries()) {
      result[`${z}/${x}/${y}`] = tiles[index]
    }

    return result
  }
}
