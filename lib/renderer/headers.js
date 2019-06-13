'use strict'

const mime = require('mime')

module.exports = function getHeaders (format) {
  const headers = {}

  if (format === 'utf') {
    headers['Content-Type'] = 'application/json'
    return headers
  }

  // NOTE: formats use mapnik syntax like `png8:m=h` or `jpeg80`
  // so we need custom handling for png/jpeg
  if (format.indexOf('png') !== -1) {
    headers['Content-Type'] = 'image/png'
    return headers
  }

  if (format.indexOf('jpeg') !== -1 || format.indexOf('jpg') !== -1) {
    headers['Content-Type'] = 'image/jpeg'
    return headers
  }

  // will default to 'application/octet-stream' if unable to detect
  headers['Content-Type'] = mime.getType(format.split(':')[0])
  return headers
}
