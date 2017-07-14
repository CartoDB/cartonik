import path from 'path'
import mapnik, { Map, Image } from 'mapnik'

const TILE_SIZE = 256
const TILE_ENCODING = 'png'

const EARTH_RADIUS = 6378137
const EARTH_DIAMETER = EARTH_RADIUS * 2
const EARTH_CIRCUMFERENCE = EARTH_DIAMETER * Math.PI
const MAX_RESOLUTION = EARTH_CIRCUMFERENCE / TILE_SIZE
const ORIGIN_SHIFT = EARTH_CIRCUMFERENCE / 2

const shapeDatasource = path.join(mapnik.settings.paths.input_plugins, 'shape.input')
mapnik.register_datasource(shapeDatasource)

export default class Cartonik {
  load ({ path }) {
    const map = new Map(TILE_SIZE, TILE_SIZE)

    return new Promise((resolve, reject) => {
      map.load(path, (err, map) => err ? reject(err) : resolve(map))
    })
  }

  render ({ map }) {
    const image = new Image(TILE_SIZE, TILE_SIZE)

    return new Promise((resolve, reject) => {
      map.render(image, (err, image) => err ? reject(err) : resolve(image))
    })
  }

  encode ({ image }) {
    return new Promise((resolve, reject) => {
      image.encode(TILE_ENCODING, (err, tile) => err ? reject(err) : resolve(tile))
    })
  }

  extent ({ z, x, y }) {
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
}
