import path from 'path'
import mapnik, { Map, Image } from 'mapnik'
import { promisify } from 'util'

const TILE_SIZE = 256

const shapeDatasource = path.join(mapnik.settings.paths.input_plugins, 'shape.input')
mapnik.register_datasource(shapeDatasource)

export default class MapRenderer {
  constructor ({ metatile } = {}) {
    this.metatile = metatile
  }

  async load ({ xml } = {}) {
    if (typeof xml !== 'string' || xml.length === 0) {
      throw new TypeError(`Bad argument: 'xml' should be a non empty string`)
    }

    const map = new Map(TILE_SIZE, TILE_SIZE)
    const fromString = map.fromString.bind(map)

    return promisify(fromString)(xml)
  }

  async render ({ map, z } = {}) {
    const { width, height } = this.metatile.dimensionsInPixels({ z })
    const image = new Image(width, height)
    const render = map.render.bind(map)

    return promisify(render)(image)
  }

  async slice ({ image, coords, encoding } = {}) {
    const { z, x, y } = coords
    const { x0, y0 } = this.metatile.x0y0({ z, x, y })

    const xInPixels = (x - x0) * TILE_SIZE
    const yInPixels = (y - y0) * TILE_SIZE

    const view = image.view(xInPixels, yInPixels, TILE_SIZE, TILE_SIZE)
    const encode = view.encode.bind(view)

    return promisify(encode)(encoding)
  }
}
