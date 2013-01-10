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
add(5, 6, t('sum3'))
add(7, 27, t('sum4'))
t('s1s2', ['sum1', 'sum2'], add)()
t('s3s4', ['sum3', 'sum4'], add)()
t('result', ['s1s2', 's3s4'], add)()

t.end(function (err, results) {
  if (err) throw err;
  console.log('result=' + results.result)
})
