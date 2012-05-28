var track = require('./track.js')

function someAsyncFunc(str, fn) {
  // do somthing async
  setTimeout(function() {
    console.log(str)
    fn(null, str)
  }, Math.round(Math.random()*1000))
}

var t = track()


someAsyncFunc('foo', t())

someAsyncFunc('bar', t(function(err, str, cb) {
  someAsyncFunc('baz', cb)
}))

t.end(function(err) {
  if (err) throw err

  console.log('finish, no errors')
})

