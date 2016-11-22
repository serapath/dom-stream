var xDom = require('x-is-dom')
var read  = require('readable-stream')
var write = read.Writable

module.exports = domStream
/******************************************************************************
  DOM STREAM
******************************************************************************/
function domStream (container) {
  container = container || document.createElement('div')
  if (!xDom(container)) throw Error('arguments[0] should be a dom element')
  var write$ = write({ objectMode: true })
  for (key in write$) { container[key] = write$[key] }
  container._write = function (element, encoding, next) {
    container.innerHTML = ''
    container.appendChild(element) // @IDEA improve perf with raf?
    next()
  }
  return container
}
