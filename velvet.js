dModule.define("velvet", function () {
  var __slice = Array.prototype.slice;

  var idCounter = 0;
  var uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  var isString = function (obj) {
    return toString.call(obj) == '[object String]';
  };

  isNumber = function(obj) {
    return toString.call(obj) == '[object Number]';
  };


  var stringWrapper = function (str) {
    var ret = function () {};
    ret.value = str;
    return ret;
  };

  var numberWrapper = function (str) {
    var ret = function () {};
    ret.value = str;
    return ret;
  };

  var wrap = function (value) {
    if (isString(value)) {
      value = stringWrapper(value);  
    } else if (isNumber(value)) {
      value = numberWrapper(value); 
    }
    return value;
  };

  var _makeObj = function () {
    var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    var obj = {}
    var set = function (key, value) {
      if (!isString(key)) {
        key = "object_" + key._id
      }    
      obj[key] = wrap(value);
    } 
    for (var i=0; i < args.length; i+=2) {
      var key = args[i];
      var value = args[i+1];
      set(key, value)
    }
    var retObj = function (key, value) {
      if (arguments.length == 1) {
        if (key._id) { // if it is a velvet object
          key = "object_" + key._id;
        }
        return obj[key]
      } else {
        set(key, value);
      }
    
    }
    retObj._id = uniqueId();
    retObj.obj = obj;
    return retObj;
  }
  
  var Velvet = {}
  Velvet.init = function () {
    //everything returns a function of what it does?
    //except for do?
    //
    
    
    var globalScope = _makeObj()
    var currentScope = globalScope;
    //do
    var d = function () {
      var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      var ret;
      for (var i=0; i < args.length; i++) {
        fn = args[i];
        ret = fn();
      }
      return ret;
    }

    //set 
    var s = function () {
      var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      var name = args[0];
      var value = args[1];
      return function () {
        currentScope(name, value);
      } 
    }

    //get
    var g = function (args) {
      var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      var val = currentScope;
      return function () {
        for (var i=0; i<args.length; i++) {
          var arg = args[i];
          val = val(arg);
        }
        return val;
      }
    } 

    //function
    var f = function () {
    
    }

    //call
    var c = function () {
    
    }

    //call2, with just the one parameter like it uses internally
    var c = function () {
    
    }

    //object o("key", "value", "key2", "value2")
    var o = function () {
    
    }
    
    //array
    var a = function () {
    
    }

    return {d:d, s:s, g:g, f:f, c:c, o:o, a:a, _makeObj:_makeObj};
  };
  return Velvet;
})
