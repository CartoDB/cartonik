'use strict'

const EventEmitter = require('events')

module.exports = class LockingCache extends EventEmitter {
  constructor (keyGenerator, generator, options) {
    super()

    this.timeouts = {}
    this.results = {}

    this.generateKeys = keyGenerator
    this.generate = generator

    options = isFinite(options) ? { timeout: options } : (options || {})

    // Timeout cached objects after 1 minute by default.
    // A value of 0 will cause it to not cache at all beyond, just return the result to
    // all locked requests.
    this.timeout = (typeof options.timeout === 'undefined') ? 60000 : options.timeout

    // Cached results will be always removed when deleteOnHit is set to true
    // That allows to set a timeout > 0 but removing objects from the cache when they
    // are returned from the cache.
    // This option is useful when using metatile > 1 because you can evict results
    // put here because of metatiling with a timeout and remove the ones that get a hit
    this.deleteOnHit = options.deleteOnHit || false
  }

  async get (id) {
    if (this.results[id] !== undefined && this.results[id] !== null) {
      return this.deliver(id)
    }

    if (this.results[id] === null) {
      const result = await this.ongoing(id)
      return this.deliver(id, result)
    }

    const ids = this.generateKeys(id)

    ids.forEach(id => { this.results[id] = null })

    try {
      const results = await this.generate(id)
      ids.forEach(id => this.put(id, results[id]))
    } catch (err) {
      // Push error objects to all entries that were supposed to be generated.
      ids.forEach(id => this.put(id, err))
    }

    return this.deliver(id)
  }

  deliver (id, result = this.results[id]) {
    if (this.timeout === 0 || this.deleteOnHit) {
      this.del(id)
    }

    if (result instanceof Error) {
      throw result
    }

    return result
  }

  ongoing (id) {
    return new Promise(resolve => this.once(id, result => resolve(result)))
  }

  put (id, result) {
    if (this.timeout > 0) {
      this.timeouts[id] = setTimeout(this.del.bind(this, id), this.timeout)
    }

    this.results[id] = result

    this.emit(id, result)
  }

  del (id) {
    delete this.results[id]

    if (this.timeouts[id]) {
      clearTimeout(this.timeouts[id])
      delete this.timeouts[id]
    }
  }

  clear () {
    for (const id in this.results) {
      this.del(id)
    }
  }
}
