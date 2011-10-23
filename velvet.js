(function() {
  var _;
  var __slice = Array.prototype.slice, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  _ = require("underscore");
  if (typeof define === "undefined" || define === null) {
    define = function() {
      var args, name, ret, _i;
      args = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), name = arguments[_i++], ret = arguments[_i++];
      return typeof module !== "undefined" && module !== null ? module.exports = ret() : void 0;
    };
  }
  define("velvet", function() {
    var compileMacros, getDefaultScope, indent, lib, parse, run, velvet, velvetEval;
    velvet = {};
    velvet.version = "0.0.1";
    getDefaultScope = function() {
      return {
        macros: {}
      };
    };
    compileMacros = velvet.compileMacros = function(code, scope) {
      var func, funcName, index, _len, _results;
      if (scope == null) {
        scope = {};
      }
      return code;
      if (_.isArray(code)) {
        _results = [];
        for (index = 0, _len = code.length; index < _len; index++) {
          func = code[index];
          funcName = func[0];
          _results.push((__indexOf.call(scope, funcName) < 0) && (funcName in scope.macros) ? 1 : void 0);
        }
        return _results;
      } else {
        return code;
      }
    };
    parse = velvet.parse = function(code) {
      var addChr, chr, closeParens, closeParensBasedOnIndent, closeQuote, closeValue, func, funcStack, inFunc, inNewLine, inQuote, inTripleQuote, indentWidth, index, isControlChr, isQuoteChr, isSpaceChr, literalParens, newLineIndentWidth, startParens, state, threeQuotes, value, _len;
      literalParens = 0;
      newLineIndentWidth = 0;
      indentWidth = 0;
      value = "";
      funcStack = [];
      func = [];
      state = "func";
      code = code.split("");
      addChr = function() {
        return value += chr;
      };
      isControlChr = function() {
        if (chr.match(/[\(\)"\s\n]/g)) {
          return true;
        } else {
          return false;
        }
      };
      closeValue = function() {
        if (value.length > 0) {
          func.push(value);
          return value = "";
        }
      };
      closeQuote = function() {
        func.push(["string", value]);
        value = "";
        return state = "func";
      };
      startParens = function() {
        funcStack.push(func);
        func = [];
        return state = "func";
      };
      closeParens = function() {
        var oldFunc;
        closeValue();
        oldFunc = func;
        func = funcStack.pop();
        if (_.isArray(func)) {
          return func.push(oldFunc);
        }
      };
      isSpaceChr = function() {
        if (chr.match(/\s/)) {
          return true;
        }
      };
      isQuoteChr = function() {
        if (chr.match(/"/)) {
          return true;
        }
      };
      threeQuotes = function() {
        return chr === '"' && code[index + 1] === '"' && code[index + 2] === '\n';
      };
      closeParensBasedOnIndent = function() {
        var closeCount, i, _results;
        closeCount = indentWidth - newLineIndentWidth + 1;
        _results = [];
        for (i = 0; 0 <= closeCount ? i < closeCount : i > closeCount; 0 <= closeCount ? i++ : i--) {
          _results.push(closeParens());
        }
        return _results;
      };
      inNewLine = function() {
        if (chr === " ") {
          return newLineIndentWidth += 0.5;
        } else if (chr === "\n") {
          return newLineIndentWidth = 0;
        } else if (chr !== " ") {
          if (newLineIndentWidth <= indentWidth) {
            closeParensBasedOnIndent();
          } else {
            1;
          }
          indentWidth = newLineIndentWidth;
          state = "func";
          startParens();
          return inFunc();
        }
      };
      inFunc = function() {
        if (!isControlChr()) {
          return addChr();
        } else if (chr === "\n") {
          if (literalParens === 0) {
            closeValue();
            state = "newline";
            return newLineIndentWidth = 0;
          }
        } else if (chr === "(") {
          literalParens += 1;
          return startParens();
        } else if (chr === ")") {
          literalParens -= 1;
          return closeParens();
        } else if (isSpaceChr()) {
          return closeValue();
        } else if (isQuoteChr()) {
          return state = "quote";
        }
      };
      inQuote = function() {
        if (threeQuotes()) {
          index += 2;
          return state = "triple_quote";
        } else if (!isQuoteChr()) {
          return addChr();
        } else if (isQuoteChr()) {
          return closeQuote();
        }
      };
      inTripleQuote = function() {
        if (chr === "\n") {
          newLineIndentWidth = 0;
        }
        if (chr === " " && newLineIndentWidth - indentWidth < 1) {
          return newLineIndentWidth += 0.5;
        } else if ((chr !== "\n") && (chr !== " ") && (newLineIndentWidth <= indentWidth)) {
          value = value.substring(0, value.length - 1);
          closeQuote();
          closeParensBasedOnIndent();
          startParens();
          return inFunc();
        } else if (chr === " " && (newLineIndentWidth <= indentWidth)) {
          return 1;
        } else {
          return addChr();
        }
      };
      startParens();
      for (index = 0, _len = code.length; index < _len; index++) {
        chr = code[index];
        if (state === "newline") {
          inNewLine();
        } else if (state === "func") {
          inFunc();
        } else if (state === "quote") {
          inQuote();
        } else if (state === "triple_quote") {
          inTripleQuote();
        }
      }
      closeValue();
      while (funcStack.length > 0) {
        closeParens();
      }
      return func;
    };
    lib = velvet.lib = {
      set: function(_arg, scope) {
        var a, b, funcName;
        a = _arg[0], b = _arg[1];
        funcName = "set";
        scope[a] = b;
        return b;
      },
      get: function(a, scope) {
        var funcName;
        funcName = "get";
        return scope[a];
      },
      string_remove: function(a, scope) {
        var funcName;
        funcName = "string";
        return a;
      },
      "do": function(args, scope) {
        var funcName, last;
        funcName = "do";
        last = null;
        return args[args.length - 1];
      }
    };
    indent = "";
    velvetEval = velvet.velvetEval = function(code, scope) {
      var args, expression, func, last, log;
      if (scope == null) {
        scope = {};
      }
      log = function(text, what) {
        if (!velvet.debug) {
          return;
        }
        if (_.isFunction(what)) {
          what = what.toString();
        } else {
          what = JSON.stringify(what);
        }
        return console.log("" + indent, text, "" + what);
      };
      indent += "----";
      scope = lib;
      expression = code;
      log("original expression", expression);
      last = null;
      if (_.isString(code)) {
        last = lib.get(code, scope);
      } else if (expression[0] === "string") {
        last = expression[1];
      } else {
        _.each(expression, function(item, j) {
          return expression[j] = velvetEval(item);
        });
        log("new expression is", expression);
        func = expression[0];
        log("func is", func);
        args = expression.slice(1);
        log("args are", args);
        last = func(args, scope);
      }
      log("returning", last);
      indent = indent.substring(0, indent.length - 4);
      return last;
    };
    run = velvet.run = function(code, scope) {
      if (scope == null) {
        scope = {};
      }
      code = parse(code);
      code = compileMacros(code);
      code.unshift("do");
      return velvetEval(code);
    };
    return velvet;
  });
}).call(this);
