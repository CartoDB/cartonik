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

    const tiles = await Promise.all(this.metatile.tiles(coords).map(({ z, x, y, xOffsetInPixels, yOffsetInPixels }) => {
      const coords = { x: xOffsetInPixels, y: yOffsetInPixels }
      const options = { image, coords, encoding }

      return this.mapRenderer.slice(options).then(tile => ({ [`${z}/${x}/${y}.${encoding}`]: tile }))
    }))

    return tiles.reduce((tiles, tile) => Object.assign(tiles, tile), {})
  }
}
