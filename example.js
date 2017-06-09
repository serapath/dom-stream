var bel = require('bel')
var domstream = require('./')

function demoComponent (opts) {
  opts || (opts = {})
  opts.placeholder = bel`<div class='loading'>...</div>` // optional

  var el$ = domstream(opts) // el$ is a read stream AND dom element

  el$.on('data', function (el) { console.log('dom element update', el) })
  setTimeout(next, 500, 0) // update dom element el$

  return el$
  function next (i) { el$.push(render(i)); setTimeout(next, 500, ++i) }
  function render (i) { return bel`<div>update ${i}</div>` }
}

var el$ = demoComponent()
document.body.appendChild(el$)
