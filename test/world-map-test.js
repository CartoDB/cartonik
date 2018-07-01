import fs from 'fs'
import path from 'path'
import mapnik from 'mapnik'
import Cartonik from '../src'
import match from './support/match'

const WORLD_MAP_XML = fs.readFileSync('./test/fixtures/world-map.xml', { encoding: 'utf-8' })
const xml = WORLD_MAP_XML

async function matchAll (tiles) {
  return Promise.all(Object.entries(tiles).map(([ key, tile ]) => match(`world-map-${key.split('/').join('.')}`, tile, 0.05)))
}

describe('world map', function () {
  before(function () {
    const shapeDatasource = path.join(mapnik.settings.paths.input_plugins, 'shape.input')
    mapnik.register_datasource(shapeDatasource)
  })

  describe('metatile = 1', function () {
    beforeEach(function () {
      this.cartonik = Cartonik.create()
    })

    describe('zoom = 0', function () {
      it('.tiles({ xml, coords: { z: 0, x: 0, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 0, x: 0, y: 0 }, format: 'png' })

        await matchAll(tiles)
      })
    })

    describe('zoom = 1', function () {
      it('.tiles({ xml, coords: { z: 1, x: 0, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 1, x: 0, y: 0 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 1, x: 1, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 1, x: 1, y: 0 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 1, x: 0, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 1, x: 0, y: 1 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 1, x: 1, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 1, x: 1, y: 1 }, format: 'png' })

        await matchAll(tiles)
      })
    })

    describe('zoom = 2', function () {
      it('.tiles({ xml, coords: { z: 2, x: 0, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 0, y: 0 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 1, y: 0 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 0, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 0, y: 1 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 1, y: 1 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 2, y: 0 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 3, y: 0 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 2, y: 1 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 3, y: 1 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 0, y: 2 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 0, y: 2 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 2 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 1, y: 2 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 0, y: 3 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 0, y: 3 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 3 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 1, y: 3 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 2 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 2, y: 2 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 2 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 3, y: 2 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 3 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 2, y: 3 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 3 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 3, y: 3 }, format: 'png' })

        await matchAll(tiles)
      })
    })
  })

  describe('metatile = 4', function () {
    beforeEach(function () {
      this.cartonik = Cartonik.create({ metatile: 4 })
    })

    describe('zoom = 0', function () {
      it('.tiles({ xml, coords: { z: 0, x: 0, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 0, x: 0, y: 0 }, format: 'png' })

        await matchAll(tiles)
      })
    })

    describe('zoom = 1', function () {
      it('.tiles({ xml, coords: { z: 1, x: 0, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 1, x: 0, y: 0 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 1, x: 1, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 1, x: 1, y: 0 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 1, x: 0, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 1, x: 0, y: 1 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 1, x: 1, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 1, x: 1, y: 1 }, format: 'png' })

        await matchAll(tiles)
      })
    })

    describe('zoom = 2', function () {
      it('.tiles({ xml, coords: { z: 2, x: 0, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 0, y: 0 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 1, y: 0 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 0, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 0, y: 1 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 1, y: 1 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 2, y: 0 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 3, y: 0 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 2, y: 1 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 3, y: 1 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 0, y: 2 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 0, y: 2 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 2 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 1, y: 2 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 0, y: 3 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 0, y: 3 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 3 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 1, y: 3 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 2 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 2, y: 2 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 2 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 3, y: 2 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 3 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 2, y: 3 }, format: 'png' })

        await matchAll(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 3 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 3, y: 3 }, format: 'png' })

        await matchAll(tiles)
      })
    })
  })
})
