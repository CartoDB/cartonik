'use strict'

const path = require('path')
const url = require('url')
const cpusNumber = require('os').cpus().length

module.exports = function normalizeURI (uri) {
  if (typeof uri === 'string') {
    uri = url.parse(uri, true)
  }

  if (typeof uri.strict === 'undefined') {
    uri.strict = false
  }

  uri.query = uri.query || {}

  if (!uri.query.base) {
    uri.query.base = `${path.resolve(uri.base || __dirname)}/`
  }

  uri.query.bufferSize = Number.isFinite(uri.query.bufferSize) && uri.query.bufferSize >= 0 ? uri.query.bufferSize : 256

  if (!uri.query.tileSize) {
    uri.query.tileSize = 256
  } else {
    uri.query.tileSize = +uri.query.tileSize
  }

  uri.query.limits = uri.query.limits || {}

  if (typeof uri.query.limits.render === 'undefined') {
    uri.query.limits.render = 0
  }

  if (typeof uri.query.metrics === 'undefined') {
    uri.query.metrics = false
  } else {
    uri.query.metrics = asBool(uri.query.metrics)
  }

  if (typeof uri.query.poolSize === 'undefined') {
    uri.query.poolSize = cpusNumber
  }

  if (typeof uri.query.poolMaxWaitingClients === 'undefined') {
    uri.query.poolMaxWaitingClients = 32
  }

  return uri
}

function asBool (val) {
  var num = +val
  return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0, '')
}
