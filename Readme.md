# Track.js


## Install

    $ npm install -S track

## Include track

```js
var track = require('track')
```

## Usage

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

## Licence

MIT
