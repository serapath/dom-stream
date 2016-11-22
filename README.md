# dom-stream
stream a dom element into a dom element container

# usage
`npm install dom-stream`

```js
var bel = require('bel')
var domstream = require('dom-stream')

var container$ = domstream(bel`<div class='container'></div>`)

// container$ is a dom element
document.body.appendChild(container$)
// container$ is a stream too
container$.write(bel`<h2>hello foo</h2>`)
setTimeout(function () {
  container$.write(bel`<h1>hello bar</h1>`)
},1000)
```
