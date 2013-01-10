;(function(undefined) {

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

    function Dependency(name) {
      this.name = name
    }
    Dependency.prototype.valueOf = function () {
      return results[this.name]
    }

    function self() {
      var id = length++
        , names = []
        , fns = []
        , dependencies = []
        , dependencyIndex = 0

      for(var i = 0, len = arguments.length, arg; i < len; i++) {
        arg = arguments[i]

        if (typeof arg === 'function') {
          fns.push(arg)
        } else if (isArray(arg)) {
          dependencies.push.apply(dependencies, arg)
        } else {
          arg = String(arg)
          names.push(arg)
          self[arg] = new Dependency(arg)
        }
      }

      return function callback(err) {
        var args = Array.prototype.slice.call(arguments)
          , that = this
          , i
          , l

        if (firstTick) {
          nextTick(function() {
            callback.apply(that, args)
          })
          return self
        }

        args = args.filter(function (arg) {
          if (arg instanceof Dependency) {
            dependencies.unshift(arg.name)
            return false
          }
          return true
        })

        while(dependencyIndex < dependencies.length) {
          var dependency = dependencies[dependencyIndex]
          if (dependency && !(dependency in results)) {
            self.once(dependency, function() {
              process.nextTick(function() {
                callback.apply(that, args)
              })
            })
            return
          }
          dependencyIndex++
        }

        if (fns.length) {
          for(i = 0, l = dependencies.length; i < l; i++) {
            args.push(dependencies[i] ? results[dependencies[i]] : undefined)
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

          results[id] = args[1]
          if (names.length) {
            for(i = names.length; i--;) {
              results[names[i]] = args[i + 1]
              self.emit(names[i], args[i + 1])
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