'use strict'

const fs = require('fs')
const { promisify } = require('util')
const { describe, it, before } = require('mocha')
const assert = require('./support/assert')
const rendererFactory = require('../lib/renderer-factory')
const preview = require('../lib/preview')
const getCenterInPixels = require('../lib/preview/center')
const getDimensions = require('../lib/preview/dimensions')
const getTileList = require('../lib/preview/tiles')
const getOffsetList = require('../lib/preview/offsets')
const blend = require('../lib/preview/blend')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const readDir = promisify(fs.readdir)

// defaults
const zoom = 5
const scale = 4
const x = 4096
const y = 4096
const quality = 256
const format = 'png'
const limit = 19008
const tileSize = 256

// fixtures
async function getFixtureTiles () {
  const tiles = {}
  const filenames = await readDir('./test/fixtures/preview/tiles/')

  for (const filename of filenames) {
    const key = filename.split('.').slice(0, 4).join('.')

    tiles[key] = await readFile(`./test/fixtures/preview/tiles/${filename}`)
  }

  return tiles
}

describe('preview', function () {
  let tiles

  before(async function () {
    tiles = await getFixtureTiles()
  })

  describe('dimensions', function () {
    it('should should fail if the image is too large', function () {
      const dimensions = { width: 4752, height: 4752 }
      assert.throws(() => getDimensions({ dimensions, scale, limit }), /Desired image is too large./)
    })

    it('should fail if (x1, y1) and (x2, y2) are equal', function () {
      const bbox = [0, 0, 0, 0]
      assert.throws(() => getDimensions({ bbox, zoom, scale, tileSize, limit }), /Incorrect coordinates/)
    })

    it('should fail if the image is too large', function () {
      const bbox = [-60, -60, 60, 60]
      const zoom = 7
      const scale = 2

      assert.throws(() => getDimensions({ bbox, zoom, scale, tileSize, limit }), /Desired image is too large./)
    })

    it('should return valid dimensions', function () {
      const bbox = [-60, -60, 60, 60]
      const scale = 1

      const dimensions = getDimensions({ bbox, zoom, scale, tileSize, limit })

      assert.deepStrictEqual(dimensions.width, 2730)
      assert.deepStrictEqual(dimensions.height, 3434)
    })
  })

  describe('center', function () {
    it('should return a valid center point in pixels', function () {
      const scale = 1
      let center = {
        x: 0,
        y: 20
      }
      center = getCenterInPixels({ center, zoom, scale, tileSize })

      assert.strictEqual(center.x, x)
      assert.strictEqual(center.y, 3631)
    })

    it('should return a valid center point in pixels for negative y', function () {
      const scale = 1
      const zoom = 2
      let center = {
        x: 39,
        y: -14
      }

      center = getCenterInPixels({ center, zoom, scale, tileSize })

      assert.strictEqual(center.x, 623)
      assert.strictEqual(center.y, 552)
    })

    it('should return center in pixels from bbox', function () {
      const bbox = [-60, -60, 60, 60]
      const scale = 1

      const center = getCenterInPixels({ bbox, zoom, scale, tileSize })

      assert.deepStrictEqual(center.x, x)
      assert.deepStrictEqual(center.y, y)
    })
  })

  describe('tiles', function () {
    it('should fail when no tiles', async function () {
      const center = {
        width: 512,
        height: 512
      }
      const dimensions = {
        width: 0,
        height: 0
      }
      assert.throws(() => getTileList({ zoom, scale, center, dimensions, tileSize }), /No coords object/)
    })

    it('should return a valid coordinates object', function () {
      const zoom = 5
      const scale = 4
      const width = 1824
      const height = 1832
      const center = { x: 4096, y: 4096 }
      const dimensions = { width, height }

      const expectedCoords = [
        { z: zoom, x: 15, y: 15 },
        { z: zoom, x: 15, y: 16 },
        { z: zoom, x: 16, y: 15 },
        { z: zoom, x: 16, y: 16 }
      ]

      const coords = getTileList({ zoom, scale, center, dimensions, tileSize })

      assert.deepStrictEqual(coords, expectedCoords)
    })

    it('should return a valid coordinates object when image exceeds y coords', function () {
      const zoom = 2
      const scale = 1
      const width = 1000
      const height = 1000
      const center = { x: 623, y: 552 }
      const dimensions = { width, height }

      const expectedCoords = [
        { z: zoom, x: 0, y: 0 },
        { z: zoom, x: 0, y: 1 },
        { z: zoom, x: 0, y: 2 },
        { z: zoom, x: 0, y: 3 },
        { z: zoom, x: 1, y: 0 },
        { z: zoom, x: 1, y: 1 },
        { z: zoom, x: 1, y: 2 },
        { z: zoom, x: 1, y: 3 },
        { z: zoom, x: 2, y: 0 },
        { z: zoom, x: 2, y: 1 },
        { z: zoom, x: 2, y: 2 },
        { z: zoom, x: 2, y: 3 },
        { z: zoom, x: 3, y: 0 },
        { z: zoom, x: 3, y: 1 },
        { z: zoom, x: 3, y: 2 },
        { z: zoom, x: 3, y: 3 },
        { z: zoom, x: 0, y: 0 },
        { z: zoom, x: 0, y: 1 },
        { z: zoom, x: 0, y: 2 },
        { z: zoom, x: 0, y: 3 }
      ]

      const coords = getTileList({ zoom, scale, center, dimensions, tileSize })

      assert.deepStrictEqual(coords, expectedCoords)
    })

    it('should return a valid coordinates object when image is much bigger than world', function () {
      const zoom = 1
      const scale = 1
      const width = 2000
      const height = 2100
      const center = { x: 100, y: 100 }
      const dimensions = { width, height }

      const expectedCoords = [
        { z: 1, x: -0, y: 0 },
        { z: 1, x: -0, y: 1 },
        { z: 1, x: 1, y: 0 },
        { z: 1, x: 1, y: 1 },
        { z: 1, x: -0, y: 0 },
        { z: 1, x: -0, y: 1 },
        { z: 1, x: 1, y: 0 },
        { z: 1, x: 1, y: 1 },
        { z: 1, x: 0, y: 0 },
        { z: 1, x: 0, y: 1 },
        { z: 1, x: 1, y: 0 },
        { z: 1, x: 1, y: 1 },
        { z: 1, x: 0, y: 0 },
        { z: 1, x: 0, y: 1 },
        { z: 1, x: 1, y: 0 },
        { z: 1, x: 1, y: 1 },
        { z: 1, x: 0, y: 0 },
        { z: 1, x: 0, y: 1 }
      ]

      const coords = getTileList({ zoom, scale, center, dimensions, tileSize })

      assert.deepStrictEqual(coords, expectedCoords)
    })

    it('should return a valid coordinates object when image is smaller than world', function () {
      const zoom = 1
      const scale = 1
      const width = 256
      const height = 256
      const center = { x: 256, y: 256 }
      const dimensions = { width, height }

      const expectedCoords = [
        { z: 1, x: 0, y: 0 },
        { z: 1, x: 0, y: 1 },
        { z: 1, x: 1, y: 0 },
        { z: 1, x: 1, y: 1 }
      ]

      const coords = getTileList({ zoom, scale, center, dimensions, tileSize })

      assert.deepStrictEqual(coords, expectedCoords)
    })
  })

  describe('offsets', function () {
    it('should return a valid offsets object', function () {
      const zoom = 5
      const scale = 4
      const width = 1824
      const height = 1832
      const center = { x: 4096, y: 4096 }
      const dimensions = { width, height }

      const expectedOffsets = [
        { x: -112, y: -108 },
        { x: -112, y: 916 },
        { x: 912, y: -108 },
        { x: 912, y: 916 }
      ]

      const offsets = getOffsetList({ zoom, scale, center, dimensions, tileSize })

      assert.deepStrictEqual(offsets, expectedOffsets)
    })

    it('should return a valid offsets object when image exceeds y coords', function () {
      const zoom = 2
      const scale = 1
      const width = 1000
      const height = 1000
      const center = { x: 623, y: 552 }
      const dimensions = { width, height }

      const expectedOffsets = [
        { x: -123, y: -52 },
        { x: -123, y: 204 },
        { x: -123, y: 460 },
        { x: -123, y: 716 },
        { x: 133, y: -52 },
        { x: 133, y: 204 },
        { x: 133, y: 460 },
        { x: 133, y: 716 },
        { x: 389, y: -52 },
        { x: 389, y: 204 },
        { x: 389, y: 460 },
        { x: 389, y: 716 },
        { x: 645, y: -52 },
        { x: 645, y: 204 },
        { x: 645, y: 460 },
        { x: 645, y: 716 },
        { x: 901, y: -52 },
        { x: 901, y: 204 },
        { x: 901, y: 460 },
        { x: 901, y: 716 }
      ]

      const offsets = getOffsetList({ zoom, scale, center, dimensions, tileSize })

      assert.deepStrictEqual(offsets, expectedOffsets)
    })

    it('should return a valid offsets object when image is much bigger than world', function () {
      const zoom = 1
      const scale = 1
      const width = 2000
      const height = 2100
      const center = { x: 100, y: 100 }
      const dimensions = { width, height }

      const expectedOffsets = [
        { x: -124, y: 950 },
        { x: -124, y: 1206 },
        { x: 132, y: 950 },
        { x: 132, y: 1206 },
        { x: 388, y: 950 },
        { x: 388, y: 1206 },
        { x: 644, y: 950 },
        { x: 644, y: 1206 },
        { x: 900, y: 950 },
        { x: 900, y: 1206 },
        { x: 1156, y: 950 },
        { x: 1156, y: 1206 },
        { x: 1412, y: 950 },
        { x: 1412, y: 1206 },
        { x: 1668, y: 950 },
        { x: 1668, y: 1206 },
        { x: 1924, y: 950 },
        { x: 1924, y: 1206 }
      ]

      const offsets = getOffsetList({ zoom, scale, center, dimensions, tileSize })

      assert.deepStrictEqual(offsets, expectedOffsets)
    })

    it('should return a valid offset object when image is smaller than world', function () {
      const zoom = 1
      const scale = 1
      const width = 256
      const height = 256
      const center = { x: 256, y: 256 }
      const dimensions = { width, height }

      const expectedOffset = [
        { x: -128, y: -128 },
        { x: -128, y: 128 },
        { x: 128, y: -128 },
        { x: 128, y: 128 }
      ]

      const offsets = getOffsetList({ zoom, scale, center, dimensions, tileSize })

      assert.deepStrictEqual(offsets, expectedOffset)
    })
  })

  describe('blend', function () {
    const sizes = [256, 512, 1024]

    sizes.forEach((size) => {
      function getTileTest (format, z, x, y) {
        const key = [z, x, y, size].join('.')

        return !tiles[key]
          ? Promise.reject(new Error('Tile does not exist'))
          : Promise.resolve({ tile: tiles[key] })
      }

      const coords = [
        { z: 1, x: 0, y: 0 },
        { z: 1, x: 0, y: 1 },
        { z: 1, x: 1, y: 0 },
        { z: 1, x: 1, y: 1 }
      ]

      const offsets = [
        { x: 0, y: 0 },
        { x: 0, y: size },
        { x: size, y: 0 },
        { x: size, y: size }
      ]

      const center = {
        width: size * 2,
        height: size * 2
      }

      it(`should stitch tiles together using size = ${size}`, async function () {
        const { image } = await blend({ coordinates: coords, offsets, dimensions: center, format, quality, getTile: getTileTest })

        await writeFile(`./test/fixtures/output/pngs/preview-expected.${size}.png`, image)

        await assert.imageEqualsFile(image, `./test/fixtures/preview/expected/expected.${size}.png`)
      })
    })
  })

  describe('preview', function () {
    const sizes = [256, 512, 1024]

    sizes.forEach(function (size) {
      function getTileTest (format, z, x, y) {
        const key = [z, x, y, size].join('.')

        return !tiles[key]
          ? Promise.reject(new Error('Tile does not exist'))
          : Promise.resolve({ tile: tiles[key] })
      }

      it('should stitch images using center coordinate', async function () {
        const params = {
          zoom: 1,
          scale: 1,
          center: {
            x: 0,
            y: 0
          },
          dimensions: {
            width: 200,
            height: 200
          },
          format: 'png',
          quality: 50,
          tileSize: size,
          getTile: getTileTest
        }

        const { image } = await preview(params)

        await writeFile(`./test/fixtures/output/pngs/preview-center.${size}.png`, image)

        await assert.imageEqualsFile(image, `./test/fixtures/preview/expected/center.${size}.png`)
      })

      it('should stitch images using a bounding box (wsen)', async function () {
        const params = {
          zoom: 1,
          scale: 1,
          bbox: [ -140, -80, 140, 80 ],
          format: 'png',
          quality: 50,
          tileSize: size,
          getTile: getTileTest
        }

        const { image } = await preview(params)

        writeFile(`./test/fixtures/output/pngs/preview-bbox.${size}.png`, image)

        await assert.imageEqualsFile(image, `./test/fixtures/preview/expected/bbox.${size}.png`)
      })
    })

    const rendererOptions = {
      type: 'raster',
      xml: fs.readFileSync('./test/fixtures/mmls/world-borders.xml', 'utf8'),
      base: './test/fixtures/datasources/shapefiles/world-borders/'
    }

    const options = Object.assign({}, rendererOptions, {
      xml: fs.readFileSync('./test/fixtures/mmls/world-borders-interactivity.xml', 'utf8')
    })

    it('should use cartonik\'s getTile method to fetch tiles and stich them using bbox', async function () {
      const renderer = rendererFactory(options)

      const params = {
        zoom: 1,
        scale: 1,
        bbox: [-140, -80, 140, 80],
        format: 'png',
        quality: 50,
        tileSize: 256
      }

      const { image } = await renderer.getPreview(params)

      writeFile('./test/fixtures/output/pngs/acceptance-preview-bbox.256.png', image)

      await assert.imageEqualsFile(image, './test/fixtures/preview/expected/acceptance-preview-bbox.256.png')

      await renderer.close()
    })

    it('should use cartonik\'s getTile method to fetch tiles and stich them using center', async function () {
      const renderer = rendererFactory(options)

      const params = {
        zoom: 1,
        scale: 1,
        center: {
          x: 0,
          y: 0
        },
        dimensions: {
          width: 200,
          height: 200
        },
        format: 'png',
        quality: 50,
        tileSize: 256
      }

      const { image } = await renderer.getPreview(params)

      writeFile('./test/fixtures/output/pngs/acceptance-preview-center.256.png', image)

      await assert.imageEqualsFile(image, './test/fixtures/preview/expected/acceptance-preview-center.256.png')

      await renderer.close()
    })
  })
})
