import Metatile from './metatile'
import MapRenderer from './map-renderer'

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

    const map = await this.mapRenderer.load({ xml })
    const { z } = coords
    const dimensions = this.metatile.dimensions({ z })
    const { width, height } = dimensions

    map.resize(width, height)
    map.extent = this.metatile.boundingBox(coords)

    const image = await this.mapRenderer.render({ map, dimensions })

    const tiles = await Promise.all(this.metatile.tiles(coords).map((tile) => {
      const { z, x, y } = tile
      const { xOffsetInPixels, yOffsetInPixels } = tile
      const coords = { x: xOffsetInPixels, y: yOffsetInPixels }

      return this.mapRenderer.slice({ image, coords, encoding }).then(tile => ({ [`${z}/${x}/${y}.${encoding}`]: tile }))
    }))

    return tiles.reduce((result, tile) => Object.assign(result, tile), {})
  }
}
