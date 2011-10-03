(function() {
  var compile, drews, eq, equalish, fin, lex, ok, test, velvet, _, _ref;
  _ = require("underscore");
  drews = require("drews-mixins");
  _ref = drews.testing, test = _ref.test, ok = _ref.ok, eq = _ref.eq, fin = _ref.fin, equalish = _ref.equalish;
  velvet = require("./velvet.coffee");
  lex = velvet.lex, compile = velvet.compile;
  test("should parse simple parenthetical", function() {
    var code, shouldBe, symbols;
    code = "(say hi)";
    symbols = lex(code);
    shouldBe = [["say", "hi"]];
    return equalish(shouldBe, symbols);
  });
  test("should parse nested parenthetical", function() {
    var code, shouldBe, symbols;
    code = "(say (hi how are you) (doing))";
    symbols = lex(code);
    shouldBe = [["say", ["hi", "how", "are", "you"], ["doing"]]];
    return equalish(shouldBe, symbols);
  });
  test("should parse with strings", function() {
    var code, shouldBe, symbols;
    code = "(say \"hi\")\n(how (are \"you doing?\"))";
    symbols = lex(code);
    shouldBe = [["say", ["string", "hi"]], ["how", ["are", ["string", "you doing?"]]]];
    return equalish(shouldBe, symbols);
  });
  fin();
}).call(this);
