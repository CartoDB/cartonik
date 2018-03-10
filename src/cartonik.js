import path from 'path'
import mapnik, { Map, Image } from 'mapnik'
import { promisify } from 'util'
import Metatile from './metatile'

const TILE_SIZE = 256
const ALLOWED_ENCODINGS = {
  png: true
}

const shapeDatasource = path.join(mapnik.settings.paths.input_plugins, 'shape.input')
mapnik.register_datasource(shapeDatasource)

export default class Cartonik {
  static create () {
    const metatile = new Metatile()
    return new Cartonik(metatile)
  }

  constructor ({ metatile } = {}) {
    this.metatile = metatile
  }

  async _load ({ xml } = {}) {
    if (typeof xml !== 'string' || xml.length === 0) {
      throw new TypeError(`Bad argument: 'xml' should be a non empty string`)
    }

    const map = new Map(TILE_SIZE, TILE_SIZE)
    const fromString = map.fromString.bind(map)

    return promisify(fromString)(xml)
  }

  async _render ({ map, coords } = {}) {
    const { width, height } = this.metatile.dimensionsInPixels(coords)
    const image = new Image(width, height)
    const render = map.render.bind(map)

    return promisify(render)(image)
  }

  async _encode ({ image, coords, encoding } = {}) {
    const { x, y } = coords
    const { x0, y0 } = this.metatile.x0y0({ x, y })

    const xInPixels = (x - x0) * TILE_SIZE
    const yInPixels = (y - y0) * TILE_SIZE

    const view = image.view(xInPixels, yInPixels, TILE_SIZE, TILE_SIZE)
    const encode = view.encode.bind(view)

    return promisify(encode)(encoding)
  }

  async tile ({ xml, coords, format: encoding } = {}) {
    if (!ALLOWED_ENCODINGS[encoding]) {
      throw new TypeError(`Format '${encoding}' not allowed`)
    }

    const map = await this._load({ xml })
    map.extent = this.metatile.boundingBox(coords)

    const image = await this._render({ map, coords })

    const tiles = {}
    for (let metatileCoords of this.metatile.tiles(coords)) {
      const { z, x, y } = metatileCoords
      const tile = await this._encode({ image, coords: metatileCoords, encoding })
      tiles[`${z}/${x}/${y}`] = tile
    }
    // TODO: cache all tiles

    const { z, x, y } = coords

    return tiles[`${z}/${x}/${y}`]
  }
}
