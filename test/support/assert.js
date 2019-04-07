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
