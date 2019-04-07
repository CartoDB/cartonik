const fs = require('fs')
const mapnik = require('@carto/mapnik')

const assert = module.exports = exports = require('assert')

assert.imageEqualsFile = async function (buffer, file, meanError = 0.05, format = 'png32') {
  const resultImage = mapnik.Image.fromBytesSync(buffer)

  if (!fs.existsSync(file) || process.env.UPDATE) {
    resultImage.save(file, format)
  }

  const fixturesize = fs.statSync(file).size
  const sizediff = Math.abs(fixturesize - buffer.length) / fixturesize

  if (sizediff > meanError) {
    throw new Error(`Image size is too different from fixture: ${buffer.length} vs. ${fixturesize}`)
  }

  const expectImage = mapnik.Image.open(file)
  const pxDiff = expectImage.compare(resultImage)

  // Allow < 2% of pixels to vary by > default comparison threshold of 16.
  const pxThresh = resultImage.width() * resultImage.height() * 0.02

  if (pxDiff > pxThresh) {
    throw new Error(`Image is too different from fixture: ${pxDiff} pixels > ${pxThresh} pixels`)
  }
}

assert.vectorEqualsFile = function compareVectorTiles (filepath, vtile1, vtile2) {
  assert.strictEqual(vtile1.tileSize, vtile2.tileSize)
  // assert.strictEqual(vtile1.height(),vtile2.height());
  assert.deepStrictEqual(vtile1.names(), vtile2.names())
  assert.deepStrictEqual(vtile1.names(), vtile2.names())
  // assert.strictEqual(vtile1.isSolid(),vtile2.isSolid());
  assert.strictEqual(vtile1.empty(), vtile2.empty())
  var v1 = vtile1.toJSON()
  var v2 = vtile2.toJSON()
  assert.strictEqual(v1.length, v2.length)
  var l1 = v1[0]
  var l2 = v2[0]
  assert.strictEqual(l1.name, l2.name)
  assert.strictEqual(l1.version, l2.version)
  assert.strictEqual(l1.extent, l2.extent)
  assert.strictEqual(l1.features.length, l2.features.length)
  assert.deepStrictEqual(l1.features[0], l2.features[0])

  try {
    assert.deepStrictEqual(v1, v2)
  } catch (err) {
    var e = filepath + '.expected.json'
    var a = filepath + '.actual.json'
    fs.writeFileSync(e, JSON.stringify(JSON.parse(vtile1.toGeoJSON('__all__')), null, 2))
    fs.writeFileSync(a, JSON.stringify(JSON.parse(vtile2.toGeoJSON('__all__')), null, 2))
    assert.ok(false, 'files json representations differs: \n' + e + '\n' + a + '\n')
  }
}
