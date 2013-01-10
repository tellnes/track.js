# Track.js


## Install

    $ npm install -S track

## Include track

```js
var track = require('track')
```

## Express example

```js
app.get('/', function(req, res, next) {
  var t = track()

  db.select('user', t('user'))

  db.select('data', t('data'))

  t.end(function(err, locals) {
    if (err) return next(err)

    res.render('something', locals)
  })

```

## Hello World example

```js
var t = track()

t('name', function (cb) {
  cb(null, 'World')
})()

t('hello', ['name'], function (name, cb) {
  cb(null, 'Hello ' + name)
})()

t.end(function(err, results) {
  console.log(results.hello === 'Hello World')
})
```

## Licence

MIT
