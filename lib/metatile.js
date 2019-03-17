const { TILE_SIZE, EARTH_CIRCUMFERENCE, ORIGIN_SHIFT } = require('./defaults')

module.exports = class Metatile {
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

  constructor ({ size = 1, tileSize = TILE_SIZE } = {}) {
    this.size = size
    this.tileSize = tileSize
    this.maxResolution = EARTH_CIRCUMFERENCE / tileSize
    this.length = Math.sqrt(size)
  }

  first ({ z, x, y }) {
    const { dx, dy } = this._offset({ z })

    const xFirst = (x % dx === 0) ? x : x - (x % dx)
    const yFirst = (y % dy === 0) ? y : y - (y % dy)

    return { x: xFirst, y: yFirst }
  }

  dimensions ({ z }) {
    const { dx, dy } = this._offset({ z })

    return {
      width: dx * this.tileSize,
      height: dy * this.tileSize
    }
  }

  tiles ({ z, x, y }) {
    const tiles = []
    const { x: xFirst, y: yFirst } = this.first({ z, x, y })
    const { dx: dX, dy: dY } = this._offset({ z })

    for (let dx = 0; dx < dX; dx++) {
      for (let dy = 0; dy < dY; dy++) {
        const x = xFirst + dx
        const y = yFirst + dy
        const xOffsetInPixels = (x - xFirst) * this.tileSize
        const yOffsetInPixels = (y - yFirst) * this.tileSize

        tiles.push({ z, x, y, xOffsetInPixels, yOffsetInPixels })
      }
    }

    return tiles
  }

  boundingBox ({ z, x, y } = {}) {
    const resolution = this._resolution({ z })
    const { x: xFirst, y: yFirst } = this.first({ z, x, y })
    const { dx, dy } = this._offset({ z })

    const minx = (xFirst * this.tileSize) * resolution - ORIGIN_SHIFT
    const miny = -((yFirst + dy) * this.tileSize) * resolution + ORIGIN_SHIFT
    const maxx = ((xFirst + dx) * this.tileSize) * resolution - ORIGIN_SHIFT
    const maxy = -(yFirst * this.tileSize) * resolution + ORIGIN_SHIFT

    const bbox = [ minx, miny, maxx, maxy ]

    return bbox
  }

  _offset ({ z }) {
    const tileLength = this._zoomTileLength({ z })

    const offset = (tileLength < this.length) ? tileLength : this.length

    return { dx: offset, dy: offset }
  }

  _resolution ({ z }) {
    return this.maxResolution / this._zoomTileLength({ z })
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
