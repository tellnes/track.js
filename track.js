(function() {

  var nextTick = (typeof process !== 'undefined') && process.nextTick || function(fn) {
    setTimeout(fn, 0)
  }

  var isArray = Array.isArray || function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }

  var EventEmitter
  try {
    EventEmitter = require('events').EventEmitter
  } catch(e) {
    EventEmitter = function EventEmitter() { this._events = {} }
    EventEmitter.prototype.on = function(name, fn) {
      if (!this._events[name]) this._events[name] = []
      this._events[name].push(fn)
    }
    EventEmitter.prototype.once = function(name, fn) {
      var listener = function() {
        listerner.apply(this, arguments)
        this.removeListener(name, listener)
      }
      listener.listener = fn
      this.on(name, listener)
    }
    EventEmitter.prototype.removeListener = function(name, fn) {
      if (this._events[name]) {
        for(var i = 0, l = this._events[name].length; i < l; i++) {
          if (this._events[name][i] == fn || this._events[name][i].listener == fn) {
            this._events[name].splice(i, 1)
            return
          }
        }
      }
    }
    EventEmitter.prototype.emit = function(name) {
      var args = Array.prototype.slice.call(arguments, 1)
      if (this._events[name]) {
        for(var i = 0, events = Array.prototype.slice.call(this._events[name]), l = events.length; i < l; i++) {
          events[i].apply(this, args)
        }
      }
    }
  }

  function track() {
    var results = []
      , firstTick = true
      , length = 0
      , called = 0
      , end

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
        , fns = []
        , needs = []
        , needsIndex = 0

      for(var i = 0, len = arguments.length, arg; i < len; i++) {
        arg = arguments[i]

        if (typeof arg === 'function') {
          fns.push(arg)
        } else if (isArray(arg)) {
          needs.push.apply(needs, arg)
        } else {
          names.push(String(arg))
        }
      }

      return function callback(err) {
        var args = Array.prototype.slice.call(arguments)
          , that = this

        if (firstTick) {
          nextTick(function() {
            callback.apply(that, args)
          })
          return self
        }

        while(needsIndex < needs.length) {
          var need = needs[needsIndex]
          if (!(need in results)) {
            self.once(need, function() {
              process.nextTick(function() {
                callback.apply(that, args)
              })
            })
            return
          }
          needsIndex++
        }

        if (fns.length) {
          var i, l

          for(i = 0, l = needs.length; i < l; i++) {
            args.push(results[needs[i]])
          }

          l = fns[0].length - 1
          while (l > args.length) {
            args.push(null)
          }

          args.push(callback)

          var fn = fns.shift().apply(this, args)

        } else if (err) {
          end && end(err)
          end = null

        } else {
          called++

          results[id] = args.slice(1)
          if (names.length) {
            for(var i = names.length; i--;) {
              results[names[i]] = results[id][i]
              self.emit(names[i], results[id][i])
            }
          }

          check()
        }

        return self
      }
    }

    self.__proto__ = EventEmitter.prototype
    EventEmitter.call(self)

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