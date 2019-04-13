'use strict'

const path = require('path')
const cpusNumber = require('os').cpus().length

module.exports = function defaults (options) {
  options = options || {}

  if (typeof options.strict === 'undefined') {
    options.strict = false
  }

  if (!options.base) {
    options.base = `${path.resolve(options.base || __dirname)}/`
  }

  if (typeof options.variables === 'undefined') {
    options.variables = {}
  }

  options.bufferSize = Number.isFinite(options.bufferSize) && options.bufferSize >= 0 ? options.bufferSize : 256

  options.gzip = typeof options.gzip === 'boolean' ? options.gzip : true

  if (!options.tileSize) {
    options.tileSize = 256
  } else {
    options.tileSize = +options.tileSize
  }

  options.limits = options.limits || {}

  if (typeof options.limits.render === 'undefined') {
    options.limits.render = 0
  }

  if (typeof options.metrics === 'undefined') {
    options.metrics = false
  } else {
    options.metrics = asBool(options.metrics)
  }

  if (typeof options.poolSize === 'undefined') {
    options.poolSize = cpusNumber
  }

  if (typeof options.poolMaxWaitingClients === 'undefined') {
    options.poolMaxWaitingClients = 32
  }

  if (!options.metatile) {
    options.metatile = 2
  } else {
    options.metatile = +options.metatile
  }

  if (!options.resolution) {
    options.resolution = 4
  } else {
    options.resolution = +options.resolution
  }

  if (!Number.isFinite(options.bufferSize)) {
    options.bufferSize = 128
  }

  if (!options.scale) {
    options.scale = 1
  } else {
    options.scale = +options.scale
  }

  options.metatileCache = options.metatileCache || {}

  // Time to live in ms for cached tiles/grids
  // When set to 0 and `deleteOnHit` set to `false` object won't be removed
  // from cache until they are requested
  // When set to > 0 objects will be removed from cache after the number of ms
  options.metatileCache.ttl = options.metatileCache.ttl || 0

  // Overrides object removal behaviour when ttl>0 by removing objects from
  // from cache even if they had a ttl set
  options.metatileCache.deleteOnHit = options.metatileCache.hasOwnProperty('deleteOnHit')
    ? asBool(options.metatileCache.deleteOnHit)
    : false

  return options
}

function asBool (val) {
  var num = +val
  return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0, '')
}
