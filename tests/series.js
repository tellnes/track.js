var test = require('tap').test
  , track = require('../track')


test('series', function(ta) {
  ta.plan(3)

  var t = track()

  var i = 0

  t(function(cb) {
    setTimeout(function() {
      ta.ok(++i == 1, 'callback should be called in series')
      cb()
    }, 1)
  }, function(cb) {
    ta.ok(++i == 2, 'callback should be called in series')
    cb()
  })()

  t.end(function(err) {
    ta.notOk(err, 'no errors')
    ta.end()
  })
})
