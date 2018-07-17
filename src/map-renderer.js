import { Map, Image } from 'mapnik'
import { promisify } from 'util'

const DEFAULT_TILE_SIZE = 256

export default class MapRenderer {
  constructor ({ tileSize = DEFAULT_TILE_SIZE } = {}) {
    this.tileSize = tileSize
  }
  async load ({ xml } = {}) {
    if (typeof xml !== 'string' || xml.length === 0) {
      throw new TypeError(`Bad argument: 'xml' should be a non empty string`)
    }

    const map = new Map(this.tileSize, this.tileSize)
    const fromString = map.fromString.bind(map)

    return promisify(fromString)(xml)
  }

  async render ({ map, dimensions } = {}) {
    const { width, height } = dimensions
    const image = new Image(width, height)
    const render = map.render.bind(map)

    return promisify(render)(image)
  }

  async slice ({ image, coords, encoding } = {}) {
    const { x, y } = coords

    const view = image.view(x, y, this.tileSize, this.tileSize)
    const encode = view.encode.bind(view)

    return promisify(encode)(encoding)
  }
}
