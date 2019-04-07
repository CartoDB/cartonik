const assert = require('assert')
const { describe, it } = require('mocha')
const LockingCache = require('../lib/lockingcache')

describe('locking cache', function () {
  it('cache works', async function () {
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: key })
    const cache = new LockingCache(keyGenerator, generate, 50)

    const value = await cache.get(1)

    assert.strictEqual(value, 1)
  })

  it('multiple requests get same response', async function () {
    let n = 0
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: n++ })
    const cache = new LockingCache(keyGenerator, generate, 50)

    const valueA = await cache.get(1)
    const valueB = await cache.get(1)

    assert.strictEqual(valueA, 0)
    assert.strictEqual(valueA, valueB)
  })

  it('multiple parallel requests get same response', function () {
    let n = 0
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: n++ })
    const cache = new LockingCache(keyGenerator, generate, 50)

    return Promise.all([cache.get(1), cache.get(1)])
      .then(results => results.forEach(value => assert.strictEqual(value, 0)))
  })

  it('errors get propagated', async function () {
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: new Error('Oops!') })
    const cache = new LockingCache(keyGenerator, generate, 50)

    try {
      await cache.get(1)
      throw new Error('Should not throw this error')
    } catch (err) {
      assert.strictEqual(err.toString(), 'Error: Oops!')
    }
  })

  it('multiple error-ed requests get the same response', async function () {
    let n = 0
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: new Error(n++) })
    const cache = new LockingCache(keyGenerator, generate, 50)

    let errorA
    let errorB

    try {
      await cache.get(1)
      throw new Error('Should not throw this error')
    } catch (err) {
      errorA = err
      assert.strictEqual(errorA.toString(), 'Error: 0')
    }

    try {
      await cache.get(1)
      throw new Error('Should not throw this error')
    } catch (err) {
      errorB = err
      assert.strictEqual(errorB.toString(), 'Error: 0')
    }

    assert.strictEqual(errorA.toString(), errorB.toString())
  })

  it('multiple paralle error-ed requests get the same response', async function () {
    let n = 0
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: new Error(n++) })
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    const cache = new LockingCache(keyGenerator, generate, 50)

    let errorA
    let errorB
    let count = 0

    cache.get(1).catch(err => {
      errorA = err
      assert.strictEqual(errorA.toString(), 'Error: 0')
      count++
    })

    cache.get(1).catch(err => {
      errorB = err
      assert.strictEqual(errorB.toString(), 'Error: 0')
      count++
    })

    await sleep(100)

    assert.strictEqual(errorA.toString(), errorB.toString())
    assert.strictEqual(count, 2)
  })

  it('derived keys get the same response', async function () {
    let n = 0
    const keyGenerator = key => [key, `${key}a`]
    const generate = async key => {
      n++
      return {
        [key]: n,
        [`${key}a`]: n
      }
    }
    const cache = new LockingCache(keyGenerator, generate, 50)

    const valueA = await cache.get('1')
    const valueB = await cache.get('1a')

    assert.strictEqual(valueA, 1)
    assert.strictEqual(valueA, valueB)
  })

  it('.clear()', async function () {
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: key })
    const cache = new LockingCache(keyGenerator, generate, 50)

    const value = await cache.get('1')

    assert.strictEqual(value, '1')
    assert.strictEqual(Object.keys(cache.results).length, 1)

    cache.clear()

    assert.strictEqual(Object.keys(cache.results).length, 0)
  })

  it('.del()', async function () {
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: key })
    const cache = new LockingCache(keyGenerator, generate, 50)

    const value = await cache.get('1')

    assert.strictEqual(value, '1')
    assert.strictEqual(Object.keys(cache.results).length, 1)

    cache.del('1')

    assert.strictEqual(Object.keys(cache.results).length, 0)
  })

  it('later requests get a cached response', async function () {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    let n = 0
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: n++ })
    const cache = new LockingCache(keyGenerator, generate, 50)

    const valueA = await cache.get('1')
    const valueB = await cache.get('1')

    assert.strictEqual(valueA, 0)
    assert.strictEqual(valueA, valueB)

    await sleep(10)

    const valueC = await cache.get('1')

    assert.strictEqual(valueA, valueC)
  })

  it('test cache with timeout=0: sequencial requests', async function () {
    let n = 0
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: n++ })
    const cache = new LockingCache(keyGenerator, generate, 0)

    const valueA = await cache.get('1')

    assert.strictEqual(valueA, 0)

    const valueB = await cache.get('1')

    assert.strictEqual(valueB, 1)
  })

  it('test cache with timeout=0: parallel requests', async function () {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    let n = 0
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: n++ })
    const cache = new LockingCache(keyGenerator, generate, 0)

    let count = 0
    let valueA
    let valueB

    cache.get('1').then(value => {
      valueA = value
      count++
    })
    cache.get('1').then(value => {
      valueB = value
      count++
    })

    await sleep(100)

    assert.strictEqual(valueA, valueB)
    assert.strictEqual(count, 2)
  })

  it('test cache with deleteOnHit=true: sequencial requests', async function () {
    let n = 0
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: n++ })
    const cache = new LockingCache(keyGenerator, generate, { deleteOnHit: true })

    const valueA = await cache.get('1')

    assert.strictEqual(valueA, 0)

    const valueB = await cache.get('1')

    assert.strictEqual(valueB, 1)
  })

  it('test cache with deleteOnHit=true: parallel requests', async function () {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    let n = 0
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: n++ })
    const cache = new LockingCache(keyGenerator, generate, { deleteOnHit: true })

    let count = 0
    let valueA
    let valueB

    cache.get('1').then(value => {
      valueA = value
      count++
    })
    cache.get('1').then(value => {
      valueB = value
      count++
    })

    await sleep(100)

    assert.strictEqual(valueA, valueB)
    assert.strictEqual(count, 2)
  })

  it('test cache with timeout=20: sequencial requests > 20 ms', async function () {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    let n = 0
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: n++ })
    const cache = new LockingCache(keyGenerator, generate, 20)

    const valueA = await cache.get('1')

    assert.strictEqual(valueA, 0)

    await sleep(25)

    const valueB = await cache.get('1')

    assert.strictEqual(valueB, 1)
  })

  it('test cache with timeout=20: sequencial requests < 20 ms', async function () {
    let n = 0
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: n++ })
    const cache = new LockingCache(keyGenerator, generate, 20)

    const valueA = await cache.get('1')

    assert.strictEqual(valueA, 0)

    const valueB = await cache.get('1')

    assert.strictEqual(valueB, 0)
  })

  it('test cache with deleteOnHit=true & timeout=20: sequencial requests', async function () {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    let n = 0
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: n++ })
    const cache = new LockingCache(keyGenerator, generate, { deleteOnHit: true, timeout: 20 })

    const valueA = await cache.get('1')

    assert.strictEqual(valueA, 0)

    await sleep(25)

    const valueB = await cache.get('1')

    assert.strictEqual(valueB, 1)
  })

  it('test cache with deleteOnHit=true & timeout=20: parallel requests', async function () {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    let n = 0
    const keyGenerator = key => [key]
    const generate = async key => ({ [key]: n++ })
    const cache = new LockingCache(keyGenerator, generate, { deleteOnHit: true, timeout: 20 })

    let count = 0
    let valueA
    let valueB

    cache.get('1').then(value => {
      valueA = value
      count++
    })
    cache.get('1').then(value => {
      valueB = value
      count++
    })

    await sleep(100)

    assert.strictEqual(valueA, 0)
    assert.strictEqual(valueA, valueB)
    assert.strictEqual(count, 2)
  })

  it('test cache with deleteOnHit=true & timeout=20: sequencial requests to different keys', async function () {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    let n = 0
    const keyGenerator = key => [key, `${key}a`]
    const generate = async key => {
      n++
      return {
        [key]: n,
        [`${key}a`]: n
      }
    }
    const cache = new LockingCache(keyGenerator, generate, { deleteOnHit: true, timeout: 20 })

    const valueA = await cache.get('1')

    assert.strictEqual(valueA, 1)

    await sleep(25)

    const valueB = await cache.get('1a')

    assert.strictEqual(valueB, 2)
  })

  it('test cache with deleteOnHit=true & timeout=20: parallel requests to different keys', async function () {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    let n = 0
    const keyGenerator = key => [key, `${key}a`]
    const generate = async key => {
      n++
      return {
        [key]: n,
        [`${key}a`]: n
      }
    }
    const cache = new LockingCache(keyGenerator, generate, { deleteOnHit: true, timeout: 20 })

    let count = 0
    let valueA
    let valueB

    cache.get('1').then(value => {
      valueA = value
      count++
    })
    cache.get('1a').then(value => {
      valueB = value
      count++
    })

    await sleep(100)

    assert.strictEqual(valueA, 1)
    assert.strictEqual(valueA, valueB)
    assert.strictEqual(count, 2)
  })
})
