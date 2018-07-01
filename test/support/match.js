import fs from 'fs'
import assert from 'assert'
import path from 'path'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const { sync: Image } = PNG

export default function matcher (fixturesPath, map, threshold = 0.05) {
  return function match (tiles) {
    return Promise.all(
      Object.entries(tiles).map(([ key, tile ]) => matchTile(fixturesPath, `${map}-${key.split('/').join('.')}`, tile, threshold))
    )
  }
}

async function matchTile (fixturesPath, fixtureName, buffer, threshold = 0.005) {
  assert.ok(buffer instanceof Buffer)

  const tile = Image.read(buffer)
  await saveResult(tile, fixtureName)

  const fixture = await getTileFixture(fixturesPath, fixtureName)
  const diff = new PNG({
    width: tile.width,
    height: tile.height
  })

  const numDiffPixels = pixelmatch(tile.data, fixture.data, diff.data, tile.width, tile.height, { threshold })

  await saveDiff(diff, fixtureName)

  const difference = numDiffPixels / (fixture.width * fixture.height)

  assert.ok(difference < threshold, `Tile ${fixtureName} does not match: difference(${difference}) < threshold(${threshold})`)
}

function getTileFixture (fixturesPath, fixtureName) {
  const fixturePath = path.join(process.cwd(), fixturesPath, fixtureName)

  return new Promise((resolve, reject) => {
    const fixture = fs.createReadStream(fixturePath)
      .pipe(new PNG())
      .on('parsed', () => resolve(fixture))
      .on('error', err => reject(err))
  })
}

function saveResult (tile, fixtureName) {
  const buffer = Image.write(tile)
  const resultPath = path.join(process.cwd(), 'test/results', fixtureName)

  return new Promise((resolve, reject) => {
    fs.writeFile(resultPath, buffer, err => err ? reject(err) : resolve())
  })
}

function saveDiff (diff, fixtureName) {
  const diffPath = path.join(process.cwd(), 'test/results', `diff-${fixtureName}`)
  const diffStream = fs.createWriteStream(diffPath)

  return new Promise((resolve, reject) => {
    if (!diff.data) {
      return resolve()
    }

    diff.pack()
      .pipe(diffStream)
      .on('error', err => reject(err))
      .on('close', () => resolve())
  })
}
