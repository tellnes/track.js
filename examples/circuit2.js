// https://github.com/tatumizer/circuit

var track = require('../')

var t = track()

function add(x, y, cb) {
   setTimeout(function () {
     cb(null, x + y)
   }, 10)
}

t('sum1', add)(1, 2) // 3
t('sum2', add)(3, 4) // 7
t('sum3', add)(5, 6) // 11
t('s1+s2', add)(t.sum1, t.sum2)
t('result', add)(t['s1+s2'], t.sum3)

t.end(function (err, results) {
  if (err) throw err
  console.log('result=' + results.result)
})
