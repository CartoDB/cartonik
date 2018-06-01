import path from 'path'
import mapnik, { Map, Image } from 'mapnik'
import { promisify } from 'util'

const TILE_SIZE = 256

const shapeDatasource = path.join(mapnik.settings.paths.input_plugins, 'shape.input')
mapnik.register_datasource(shapeDatasource)

export default class MapRenderer {
  async load ({ xml } = {}) {
    if (typeof xml !== 'string' || xml.length === 0) {
      throw new TypeError(`Bad argument: 'xml' should be a non empty string`)
    }

    const map = new Map(TILE_SIZE, TILE_SIZE)
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

    const view = image.view(x, y, TILE_SIZE, TILE_SIZE)
    const encode = view.encode.bind(view)

    return promisify(encode)(encoding)
  }
}
