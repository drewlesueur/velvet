(function() {
  var __slice = Array.prototype.slice;
  if (typeof define === "undefined" || define === null) {
    define = function() {
      var args, name, ret, _i;
      args = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), name = arguments[_i++], ret = arguments[_i++];
      return typeof module !== "undefined" && module !== null ? module.exports = ret() : void 0;
    };
  }
  define("velvet", function() {
    var velvet;
    velvet = {};
    velvet.lex = function(code) {
      var addChr, chr, closeParens, closeQuote, closeValue, func, funcStack, isControlChr, isQuoteChr, isSpaceChr, startParens, state, use_indent, value, _i, _len;
      use_indent = false;
      value = "";
      funcStack = [];
      func = [];
      state = "func";
      code = code.split("");
      addChr = function() {
        return value += chr;
      };
      isControlChr = function() {
        if (chr.match(/[\(\)"\s]/g)) {
          return true;
        } else {
          return false;
        }
      };
      closeValue = function() {
        if (value.length > 0) {
          func.push(value);
          value = "";
        }
        if (func.length === 1 && func[0] === "use_indent") {
          use_indent = true;
          return console.log("i\nyay, use indent is true\n!!!!!!!!!!!!!!!!!!!!!! ");
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
        return func.push(oldFunc);
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
      for (_i = 0, _len = code.length; _i < _len; _i++) {
        chr = code[_i];
        if (state === "func") {
          if (!isControlChr()) {
            addChr();
          } else if (chr === "(") {
            startParens();
          } else if (chr === ")") {
            closeParens();
          } else if (isSpaceChr()) {
            closeValue();
          } else if (isQuoteChr()) {
            state = "quote";
          }
        } else if (state === "quote") {
          if (!isQuoteChr()) {
            addChr();
          } else if (isQuoteChr()) {
            closeQuote();
          }
        }
      }
      return func;
    };
    return velvet;
  });
}).call(this);
