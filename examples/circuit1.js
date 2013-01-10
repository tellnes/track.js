// https://github.com/tatumizer/circuit

var track = require('../')

var t = track()

function add(x, y, cb) {
   setTimeout(function () {
     cb(null, x + y)
   }, 10)
}

add(1, 2, t('sum1'))
add(3, 4, t('sum2'))
t('result', ['sum1', 'sum2'], add)()

t.end(function (err, results) {
  if (err) throw err
  console.log('result=' + results.result)
})
