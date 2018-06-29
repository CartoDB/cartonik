import fs from 'fs'
import path from 'path'
import assert from 'assert'
import mapnik from 'mapnik'
import Cartonik from '../src'
import match from './support/match'

const WORLD_MAP_XML = fs.readFileSync('./test/fixtures/world-map.xml', { encoding: 'utf-8' })

describe('world map', function () {
  before(function () {
    const shapeDatasource = path.join(mapnik.settings.paths.input_plugins, 'shape.input')
    mapnik.register_datasource(shapeDatasource)
  })

  beforeEach(function () {
    this.cartonik = Cartonik.create()
  })

  it('.tiles({ xml, coords: { z: 0, x: 0, y: 0 }, format: \'png\' })', async function () {
    const xml = WORLD_MAP_XML
    const [ z, x, y ] = [ 0, 0, 0 ]
    const coords = { z, x, y }
    const format = 'png'

    const tiles = await this.cartonik.tiles({ xml, coords, format })

    assert.deepEqual(Object.keys(tiles), ['0/0/0.png'])
    Object.values(tiles).forEach(tile => assert.ok(tile instanceof Buffer))

    await Promise.all(Object.entries(tiles).map(([ key, tile ]) => match(`world-map-${key.split('/').join('.')}`, tile, 0.05)))
  })
})
