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

  uri.gzip = typeof uri.gzip === 'boolean' ? uri.gzip : true

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

  if (!uri.query.metatile) {
    uri.query.metatile = 2
  } else {
    uri.query.metatile = +uri.query.metatile
  }

  if (!uri.query.resolution) {
    uri.query.resolution = 4
  } else {
    uri.query.resolution = +uri.query.resolution
  }

  if (!Number.isFinite(uri.query.bufferSize)) {
    uri.query.bufferSize = 128
  }

  if (!uri.query.scale) {
    uri.query.scale = 1
  } else {
    uri.query.scale = +uri.query.scale
  }

  uri.query.metatileCache = uri.query.metatileCache || {}

  // Time to live in ms for cached tiles/grids
  // When set to 0 and `deleteOnHit` set to `false` object won't be removed
  // from cache until they are requested
  // When set to > 0 objects will be removed from cache after the number of ms
  uri.query.metatileCache.ttl = uri.query.metatileCache.ttl || 0

  // Overrides object removal behaviour when ttl>0 by removing objects from
  // from cache even if they had a ttl set
  uri.query.metatileCache.deleteOnHit = uri.query.metatileCache.hasOwnProperty('deleteOnHit')
    ? asBool(uri.query.metatileCache.deleteOnHit)
    : false

  return uri
}

function asBool (val) {
  var num = +val
  return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0, '')
}
