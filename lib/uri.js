'use strict'

const path = require('path')
const cpusNumber = require('os').cpus().length

module.exports = function normalizeURI (uri) {
  uri = uri || {}

  if (typeof uri.strict === 'undefined') {
    uri.strict = false
  }

  if (!uri.base) {
    uri.base = `${path.resolve(uri.base || __dirname)}/`
  }

  uri.bufferSize = Number.isFinite(uri.bufferSize) && uri.bufferSize >= 0 ? uri.bufferSize : 256

  uri.gzip = typeof uri.gzip === 'boolean' ? uri.gzip : true

  if (!uri.tileSize) {
    uri.tileSize = 256
  } else {
    uri.tileSize = +uri.tileSize
  }

  uri.limits = uri.limits || {}

  if (typeof uri.limits.render === 'undefined') {
    uri.limits.render = 0
  }

  if (typeof uri.metrics === 'undefined') {
    uri.metrics = false
  } else {
    uri.metrics = asBool(uri.metrics)
  }

  if (typeof uri.poolSize === 'undefined') {
    uri.poolSize = cpusNumber
  }

  if (typeof uri.poolMaxWaitingClients === 'undefined') {
    uri.poolMaxWaitingClients = 32
  }

  if (!uri.metatile) {
    uri.metatile = 2
  } else {
    uri.metatile = +uri.metatile
  }

  if (!uri.resolution) {
    uri.resolution = 4
  } else {
    uri.resolution = +uri.resolution
  }

  if (!Number.isFinite(uri.bufferSize)) {
    uri.bufferSize = 128
  }

  if (!uri.scale) {
    uri.scale = 1
  } else {
    uri.scale = +uri.scale
  }

  uri.metatileCache = uri.metatileCache || {}

  // Time to live in ms for cached tiles/grids
  // When set to 0 and `deleteOnHit` set to `false` object won't be removed
  // from cache until they are requested
  // When set to > 0 objects will be removed from cache after the number of ms
  uri.metatileCache.ttl = uri.metatileCache.ttl || 0

  // Overrides object removal behaviour when ttl>0 by removing objects from
  // from cache even if they had a ttl set
  uri.metatileCache.deleteOnHit = uri.metatileCache.hasOwnProperty('deleteOnHit')
    ? asBool(uri.metatileCache.deleteOnHit)
    : false

  return uri
}

function asBool (val) {
  var num = +val
  return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0, '')
}
