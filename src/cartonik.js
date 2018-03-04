import path from 'path'
import mapnik, { Map, Image } from 'mapnik'
import { promisify } from 'util'

const TILE_SIZE = 256
const ALLOWED_ENCODINGS = {
  png: true
}

const EARTH_RADIUS = 6378137
const EARTH_DIAMETER = EARTH_RADIUS * 2
const EARTH_CIRCUMFERENCE = EARTH_DIAMETER * Math.PI
const MAX_RESOLUTION = EARTH_CIRCUMFERENCE / TILE_SIZE
const ORIGIN_SHIFT = EARTH_CIRCUMFERENCE / 2

const shapeDatasource = path.join(mapnik.settings.paths.input_plugins, 'shape.input')
mapnik.register_datasource(shapeDatasource)

export default class Cartonik {
  async _load ({ xml } = {}) {
    if (typeof xml !== 'string' || xml.length === 0) {
      throw new TypeError(`Bad argument: 'xml' should be a non empty string`)
    }

    const map = new Map(TILE_SIZE, TILE_SIZE)
    const fromString = map.fromString.bind(map)

    return promisify(fromString)(xml)
  }

  async _render ({ map }) {
    const image = new Image(TILE_SIZE, TILE_SIZE)
    const boundRender = map.render.bind(map)

    return promisify(boundRender)(image)
  }

  async _encode ({ image, encoding }) {
    if (!ALLOWED_ENCODINGS[encoding]) {
      throw new TypeError(`Encoding '${encoding}' not allowed`)
    }

    const encode = image.encode.bind(image)

    return promisify(encode)(encoding)
  }

  _extent ({ z, x, y }) {
    const bbox = []
    const total = Math.pow(2, z)
    const resolution = MAX_RESOLUTION / total

    const minx = (x * TILE_SIZE) * resolution - ORIGIN_SHIFT
    const miny = -((y + 1) * TILE_SIZE) * resolution + ORIGIN_SHIFT
    const maxx = ((x + 1) * TILE_SIZE) * resolution - ORIGIN_SHIFT
    const maxy = -((y * TILE_SIZE) * resolution - ORIGIN_SHIFT)

    bbox.push(minx, miny, maxx, maxy)

    return bbox
  }

  async tile ({ xml, coords, format }) {
    const map = await this._load({ xml })
    map.extent = this._extent(coords)
    const image = await this._render({ map })
    const tile = await this._encode({ image, encoding: format })

    return tile
  }
}
