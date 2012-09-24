(function() {

  var nextTick = (typeof process !== 'undefined') && process.nextTick || function(fn) {
    setTimeout(fn, 0)
  }

  function track(end) {
    var results = []
      , firstTick = true
      , length = 0
      , called = 0

    nextTick(function() {
      firstTick = false
      check()
    })

    function check() {
      if (end && length == called) {
        end(null, results)
      }
    }

    function self() {
      var id = length++
        , names = []
        , fn

      for(var i = 0, len = arguments.length, arg; i < len; i++) {
        arg = arguments[i]

        if (typeof arg === 'function') {
          fn = arg
        } else {
          names.push(String(arg))
        }
      }

      return function callback(err) {
        var args = Array.prototype.slice.call(arguments)

        if (firstTick) {
          args.unshift(this)
          nextTick(callback.bind.apply(callback, args))
          return
        }


        if (fn) {
          var l = fn.length - 1

          while (l > args.length) {
            args.push(null)
          }

          args.push(callback)

          var _fn = fn
          fn = null

          _fn.apply(this, args)

        } else if (err) {
          end && end(err)
          end = null

        } else {
          called++

          results[id] = args.slice(1)
          if (names.length) {
            for(var i = names.length; i--;) {
              results[names[i]] = results[id][i]
            }
          }

          check()
        }
      }
    }


    self.end = function(fn) {
      if (fn) end = fn

      if (!firstTick) check()
    }


    return self
  }

  if (typeof module != 'undefined' && module.exports) {
    module.exports = track
  } else {
    this.track = track
  }

}())