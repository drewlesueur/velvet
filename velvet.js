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
      var addChr, chr, closeParens, closeParensBasedOnIndent, closeQuote, closeValue, func, funcStack, inFunc, inNewLine, inQuote, inTripleQuote, indentWidth, index, isControlChr, isQuoteChr, isSpaceChr, literalParens, newLineIndentWidth, removeLastChr, startParens, state, threeQuotes, value, _len;
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
      removeLastChr = function() {
        return value = value.substring(0, value.length - 2);
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
    return velvet;
  });
}).call(this);
