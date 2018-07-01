import fs from 'fs'
import path from 'path'
import mapnik from 'mapnik'
import Cartonik from '../src'
import matcher from './support/match'

describe('world map', function () {
  const map = 'world-map'
  const fixturesPath = 'test/fixtures'
  const xml = fs.readFileSync('./test/fixtures/world-map.xml', { encoding: 'utf-8' })

  before(function () {
    const shapeDatasource = path.join(mapnik.settings.paths.input_plugins, 'shape.input')
    mapnik.register_datasource(shapeDatasource)

    this.match = matcher(fixturesPath, map)
  })

  describe('metatile = 1', function () {
    beforeEach(function () {
      this.cartonik = Cartonik.create()
    })

    describe('zoom = 0', function () {
      it('.tiles({ xml, coords: { z: 0, x: 0, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 0, x: 0, y: 0 }, format: 'png' })

        await this.match(tiles)
      })
    })

    describe('zoom = 1', function () {
      it('.tiles({ xml, coords: { z: 1, x: 0, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 1, x: 0, y: 0 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 1, x: 1, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 1, x: 1, y: 0 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 1, x: 0, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 1, x: 0, y: 1 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 1, x: 1, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 1, x: 1, y: 1 }, format: 'png' })

        await this.match(tiles)
      })
    })

    describe('zoom = 2', function () {
      it('.tiles({ xml, coords: { z: 2, x: 0, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 0, y: 0 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 1, y: 0 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 0, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 0, y: 1 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 1, y: 1 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 2, y: 0 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 3, y: 0 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 2, y: 1 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 3, y: 1 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 0, y: 2 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 0, y: 2 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 2 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 1, y: 2 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 0, y: 3 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 0, y: 3 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 3 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 1, y: 3 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 2 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 2, y: 2 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 2 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 3, y: 2 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 3 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 2, y: 3 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 3 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 3, y: 3 }, format: 'png' })

        await this.match(tiles)
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

        await this.match(tiles)
      })
    })

    describe('zoom = 1', function () {
      it('.tiles({ xml, coords: { z: 1, x: 0, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 1, x: 0, y: 0 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 1, x: 1, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 1, x: 1, y: 0 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 1, x: 0, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 1, x: 0, y: 1 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 1, x: 1, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 1, x: 1, y: 1 }, format: 'png' })

        await this.match(tiles)
      })
    })

    describe('zoom = 2', function () {
      it('.tiles({ xml, coords: { z: 2, x: 0, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 0, y: 0 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 1, y: 0 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 0, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 0, y: 1 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 1, y: 1 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 2, y: 0 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 0 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 3, y: 0 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 2, y: 1 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 1 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 3, y: 1 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 0, y: 2 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 0, y: 2 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 2 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 1, y: 2 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 0, y: 3 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 0, y: 3 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 1, y: 3 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 1, y: 3 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 2 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 2, y: 2 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 2 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 3, y: 2 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 2, y: 3 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 2, y: 3 }, format: 'png' })

        await this.match(tiles)
      })

      it('.tiles({ xml, coords: { z: 2, x: 3, y: 3 }, format: \'png\' })', async function () {
        const tiles = await this.cartonik.tiles({ xml, coords: { z: 2, x: 3, y: 3 }, format: 'png' })

        await this.match(tiles)
      })
    })
  })
})
