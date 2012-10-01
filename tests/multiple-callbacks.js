var test = require('tap').test
  , track = require('../track')


test('multiple callbacks', function(ta) {
  ta.plan(3)

  var t = track()

  t(function(cb) {
    ta.ok(1)
    cb()
  }, function(cb) {
    ta.ok(1)
    cb()
  })()

  t.end(function(err) {
    ta.notOk(err, 'no errors')
    ta.end()
  })
})
