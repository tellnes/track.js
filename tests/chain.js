var test = require('tap').test
  , track = require('../track')


test('chain', function(ta) {
  ta.plan(3)

  track()
  (function(cb) {
    ta.ok(1)
    cb()
  })()
  (function(cb) {
    ta.ok(1)
    cb()
  })()
  .end(function(err) {
    ta.notOk(err, 'no errors')
    ta.end()
  })
})
