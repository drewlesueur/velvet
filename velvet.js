(function() {
  var define, _;
  var __slice = Array.prototype.slice;
  _ = require("underscore");
  define = function() {
    var args, name, ret, _i;
    args = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), name = arguments[_i++], ret = arguments[_i++];
    return typeof module !== "undefined" && module !== null ? module.exports = ret() : void 0;
  };
  define("velvet", function() {
    var velvet;
    velvet = {};
    velvet.version = "0.0.1";
    velvet.lex = function(code) {
      var addChr, chr, closeCount, closeParens, closeQuote, closeValue, func, funcStack, i, inFunc, indentWidth, isControlChr, isQuoteChr, isSpaceChr, literalParens, newLineIndentWidth, startParens, state, value, _i, _len;
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
      inFunc = function() {
        if (!isControlChr()) {
          return addChr();
        } else if (chr === "\n") {
          if (literalParens === 0) {
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
      startParens();
      for (_i = 0, _len = code.length; _i < _len; _i++) {
        chr = code[_i];
        if (state === "newline") {
          if (chr === " ") {
            newLineIndentWidth += 0.5;
          } else if (chr === "\n") {
            newLineIndentWidth = 0;
          } else if (chr !== " ") {
            console.log("yay got here!!\nindentWidth = " + indentWidth + "\nnewLineIndentWidth = " + newLineIndentWidth);
            if (newLineIndentWidth <= indentWidth) {
              closeCount = indentWidth - newLineIndentWidth + 1;
              console.log("\ncloseCount is " + closeCount + "\nindentWidth is " + indentWidth + "\nnewLineIndentWidth is " + newLineIndentWidth + "\nchr is " + chr + "\n*****$$$$$*****\n");
              for (i = 0; 0 <= closeCount ? i < closeCount : i > closeCount; 0 <= closeCount ? i++ : i--) {
                closeParens();
              }
            } else {
              1;
            }
            indentWidth = newLineIndentWidth;
            state = "func";
            startParens();
            inFunc();
          }
        } else if (state === "func") {
          inFunc();
        } else if (state === "quote") {
          if (!isQuoteChr()) {
            addChr();
          } else if (isQuoteChr()) {
            closeQuote();
          }
        }
      }
      closeValue();
      while (funcStack.length > 0) {
        closeParens();
      }
      return func;
    };
    return velvet;
  });
}).call(this);
