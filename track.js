(function() {

  nextTick = process && process.nextTick || function(fn) {
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

    function self(fn) {
      var id = length++
        , cb
        , name

      if (fn) {
        if (typeof fn === 'function') {
          cb = self()
        } else {
          name = String(fn)
          fn = null
        }
      }

      return function callback(err) {
        var args = Array.prototype.slice.call(arguments)

        if (firstTick) {
          args.unshift(this)
          nextTick(callback.bind.apply(callback, args))
          return
        }


        called++

        results[id] = args.slice(1)
        if (name) results[name] = results[id][0]


        if (fn) {
          var l = fn.length - 1

          while (l > args.length) {
            args.push(null)
          }

          args.push(cb)

          fn.apply(this, args)

        } else if (err) {
          end && end(err)
          end = null

        } else {
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