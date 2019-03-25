'use strict'

module.exports = function timeoutDecorator (fn, ms, errorMsg) {
  return function (...args) {
    return Promise.race([
      fn(...args),
      new Promise((resolve, reject) => setTimeout(() => reject(new Error(errorMsg)), ms))
    ])
  }
}
