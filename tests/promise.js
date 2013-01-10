var test = require('tap').test
  , track = require('../track')


test('promise', function(ta) {

  var t = track()

  function add(x, y, cb) {
    ta.type(x, 'number')
    ta.type(y, 'number')
    ta.type(cb, 'function')
    ta.equal(arguments.length, 3)
    process.nextTick(function () {
      cb(null, x + y)
    })
  }

  t('sum1', add)(1, 2)
  t('sum2', add)(3, 4)
  t('result', add)(t.sum1, t.sum2)

  t.end(function (err, tr) {
    ta.notOk(err, 'no errors')
    ta.equal(tr.result, 10)
    ta.ok(t.sum1 == 3)
    ta.end()
  })
})
