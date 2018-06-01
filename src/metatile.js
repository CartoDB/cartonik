const TILE_SIZE = 256
const EARTH_RADIUS = 6378137
const EARTH_DIAMETER = EARTH_RADIUS * 2
const EARTH_CIRCUMFERENCE = EARTH_DIAMETER * Math.PI
const ORIGIN_SHIFT = EARTH_CIRCUMFERENCE / 2
const MAX_RESOLUTION = EARTH_CIRCUMFERENCE / TILE_SIZE

export default class Metatile {
  //       ◄─── dx ──►
  //   ▲   ╬═════════╦═════════╬─────────┼─────────┼─
  //   |   ║         │         ║         │         │
  //  dy   ║  x0,y0  │  x1,y0  ║   ...   │  xn,y0  │
  //   |   ║         │         ║         │         │
  //   ▼  ─╠───── size = 4 ────╣─────────┼─────────┼─
  //       ║         │         ║         │         │
  //       ║  x0,y1  │  x1,y1  ║   ...   │   ...   │
  //       ║         │         ║         │         │
  //      ─╬═════════╬═════════╬─────────┼─────────┼─
  //       │         │         │         │         │
  //       │   ...   │   ...   │   ...   │   ...   │
  //       │         │         │         │         │
  //      ─┼─────────┼─────────┼─────────┼─────────┼─
  //       │         │         │         │         │
  //       │  x0,yn  │   ...   │   ...   │  xn,yn  │
  //       │         │         │         │         │
  //      ─└─────────┼─────────┼─────────┼─────────┼─
  //       │         │         │         │         │

  constructor ({ size = 1 } = {}) {
    this.size = size
    this.length = Math.sqrt(size)
  }

  x0y0 ({ z, x, y }) {
    const { dx, dy } = this._offset({ z })

    const x0 = (x % dx === 0) ? x : x - (x % dx)
    const y0 = (y % dy === 0) ? y : y - (y % dy)

    return { x0, y0 }
  }

  xnyn ({ z, x, y }) {
    const { x0, y0 } = this.x0y0({ z, x, y })
    const { dx, dy } = this._offset({ z })

    const xn = (x0 + dx)
    const yn = (y0 + dy)

    return { xn, yn }
  }

  _offset ({ z }) {
    const tileLength = this._zoomTileLength({ z })

    const offset = (tileLength < this.length) ? tileLength : this.length

    return { dx: offset, dy: offset }
  }

  dimensions ({ z }) {
    const { dx, dy } = this._offset({ z })

    return {
      width: dx * TILE_SIZE,
      height: dy * TILE_SIZE
    }
  }

  tiles ({ z, x, y }) {
    const tiles = []
    const { x0, y0 } = this.x0y0({ z, x, y })
    const { dx: dX, dy: dY } = this._offset({ z })

    for (let dx = 0; dx < dX; dx++) {
      for (let dy = 0; dy < dY; dy++) {
        tiles.push({
          z,
          x: x0 + dx,
          y: y0 + dy
        })
      }
    }

    return tiles
  }

  boundingBox ({ z, x, y } = {}) {
    const resolution = this._resolution({ z })
    const { x0: xmin, y0: ymin } = this.x0y0({ z, x, y })
    const { xn: xmax, yn: ymax } = this.xnyn({ z, x, y })

    const minx = (xmin * TILE_SIZE) * resolution - ORIGIN_SHIFT
    const miny = -(ymax * TILE_SIZE) * resolution + ORIGIN_SHIFT
    const maxx = (xmax * TILE_SIZE) * resolution - ORIGIN_SHIFT
    const maxy = -(ymin * TILE_SIZE) * resolution + ORIGIN_SHIFT

    const bbox = [ minx, miny, maxx, maxy ]

    return bbox
  }

  _resolution ({ z }) {
    return MAX_RESOLUTION / this._zoomTileLength({ z })
  }

  _zoomTileLength ({ z }) {
    //  z = 0 => 2^0 = 1
    //  length = 1
    // ◄─────────►
    // ╔═════════╗
    // ║         ║
    // ║   0,0   ║
    // ║         ║
    // ╚═════════╝
    //
    //    z = 1 => 2^1 = 2
    //      length = 2
    // ◄───────────────────►
    // ╔═════════╦═════════╗
    // ║         ║         ║
    // ║   0,0   ║   1,0   ║
    // ║         ║         ║
    // ╠═════════╬═════════╣
    // ║         ║         ║
    // ║   0,1   ║   1,1   ║
    // ║         ║         ║
    // ╚═════════╩═════════╝

    return Math.pow(2, z)
  }
}
