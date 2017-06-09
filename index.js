var xDom = require('x-is-dom')
var read = require('readable-stream/readable')
// var write = require('readable-stream/writable')

function copy (from, to) { for (var key in from) to[key] = from[key] }

module.exports = domStream
/******************************************************************************
  DOM STREAM

    @TODO: maybe a duplex stream instead???

      OUTPUT-> innerINPUT -> processing -> innerINPUT -> INPUT

      function component (cache) {
        cache || (cache = {})
        var action = cache.action || 'reset'

        function template () { return document.createElement('div') }

        var a
        var b
        var duplex$ = duplexify(a, b)
        var duplex$ = new DuplexStream()

        a.on('data', function () {
          // processing
          b.write(template())
          b.push(template()) // ??
        })

        return duplex$
      }
      var duplex$ = component()

      document.body.appendChild(duplex$)

      // @TODO: reads give back dom elemens (or maybe hydratable html)
      duplex$.on('data', function (el) { console.log(el) })

      duplex.write({ type: 'data', key: 'classname', value: '.visible' })
      // OR:
      // @TODO: writes feed control commands to it

      // dom$.on('data', function (event) {
      //   if (event.type === 'name') return (name = event.data,dom$.push(template()))
      //   if (event.type === 'classname') return (classname = event.data,dom$.push(template()))
      //   if (event.type === 'markdown') return (markdown = event.data,dom$.push(template()))
      //   if (event.type === 'action') {
      //     return (action = event.data,dom$.push(template()))
      //   }
      // })

******************************************************************************/
// domStream.prototype.__proto__ = write.prototype
domStream.prototype.__proto__ = read.prototype
domStream.prototype._read = function read (size) { }
domStream.prototype._destroy = function destroy (error) {
  if (error) throw error
  // @TODO: else release resources
  // @TODO: maybe remove DOM node?
}
function domStream (opts) {
  opts || (opts = {})
  opts.objectMode = true
  // var write$ = write(opts)
  var read$ = read(opts)
  // write$.__proto__ = domStream.prototype
  read$.__proto__ = domStream.prototype
  /* @IDEA
    var el = document.createElement('div')
    var el$ = function (x) { console.log('pull streams') }
    Object.keys(el).forEach(key => el$[key] = el[key])
    el$.__proto__ = el
  */
  var el$ = opts.placeholder
  if (!xDom(el$)) el$ = document.createElement('div')

  // copy(write$, el)
  copy(read$.__proto__.__proto__, el$)
  copy(read$.__proto__, el$)
  copy(read$, el$)

  // container._write = function (element, encoding, next) {
  //   el$.innerHTML = ''
  //   el$.appendChild(element) // @IDEA improve perf with raf?
  //   next()
  // }
  read$.on('data', function (el) {
    // @TODO: maybe act onload and onunload (maybe trigger .destroy())
    setTimeout(function insert () {
      if (el$.parentNode) {
        el$.parentNode.replaceChild(el, el$)
        el$ = el
      } else setTimeout(insert, 0)
    }, 0)
  })
  el$.push = el$.push.bind(read$)

  return el$
  /* IDEA
    var tag = 'bel'
    function select (tag) { return tag === 'bel' ? bel : _=>_ }
    select(tag)`<div></div>`
    test({a:3})`asdf${123}bsdf`
    function test () {
      return function (a,b) {
        console.log('m3h')
        console.log(a,b)
        return 5
      }
    }
  */
}
