var test = require('tap').test
  , track = require('../track')


test('simple', function(ta) {
  var t = track()

  ta.type(t.end, 'function', 'track#end is function')
  ta.ok(t instanceof process.EventEmitter, 'inherits from EventEmitter')

  t.end(function(err) {
    ta.notOk(err, 'no errors')

    ta.end()
  })
})

test('named', function(ta) {
  var t = track()

  t('hello')(null, 'world')

  t.end(function(err, tr) {
    ta.notOk(err, 'no errors')

    ta.end()
  })
})

test('needs', function(ta) {
  var t = track()

  t('hello', function(cb) {
    cb(null, 'hello')
  })()

  t('world', function(cb) {
    cb(null, 'world')
  })()

  t('concat', ['hello', 'world'], function(hello, world, cb) {
    cb(null, hello + ' ' + world)
  })()

  t.end(function(err, tr) {
    ta.notOk(err, 'no errors')

    ta.equal(tr.hello, 'hello')
    ta.deepEqual(tr[0], ['hello'])

    ta.equal(tr.world, 'world')
    ta.deepEqual(tr[1], ['world'])

    ta.equal(tr.concat, 'hello world')
    ta.deepEqual(tr[2], ['hello world'])

    ta.equal(tr.length, 3)

    ta.equal(Object.keys(tr).length, 6)

    ta.end()
  })
})
