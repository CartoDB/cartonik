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

    const tiles = {}

    for (let metatileCoords of this.metatile.tiles(coords)) {
      const { z, x, y } = metatileCoords
      const tile = await this.mapRenderer.encode({ image, coords: metatileCoords, encoding })

      tiles[`${z}/${x}/${y}`] = tile
    }

    return tiles
  }
}
