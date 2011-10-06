(function() {
  var compile, drews, eq, equalish, fin, lex, ok, run, test, velvet, _, _ref;
  _ = require("underscore");
  drews = require("drews-mixins");
  _ref = drews.testing, test = _ref.test, ok = _ref.ok, eq = _ref.eq, fin = _ref.fin, equalish = _ref.equalish;
  velvet = require("./velvet.coffee");
  lex = velvet.lex, compile = velvet.compile, run = velvet.run;
  test("should parse simple parenthetical", function() {
    var code, shouldBe, symbols;
    code = "say hi";
    symbols = lex(code);
    shouldBe = [["say", "hi"]];
    return equalish(shouldBe, symbols);
  });
  test("should parse nested parenthetical", function() {
    var code, shouldBe, symbols;
    code = "say (hi how are you) (doing)";
    symbols = lex(code);
    shouldBe = [["say", ["hi", "how", "are", "you"], ["doing"]]];
    return equalish(shouldBe, symbols);
  });
  test("should parse with strings", function() {
    var code, shouldBe, symbols;
    code = "say \"hi\"\nhow (are \"you doing?\")";
    symbols = lex(code);
    shouldBe = [["say", ["string", "hi"]], ["how", ["are", ["string", "you doing?"]]]];
    return equalish(shouldBe, symbols);
  });
  test("simple with multiline", function() {
    var code, shouldBe, symbols;
    code = "say \"hi\"\nhow (are \n\n  \"you doing?\")";
    symbols = lex(code);
    shouldBe = [["say", ["string", "hi"]], ["how", ["are", ["string", "you doing?"]]]];
    return equalish(shouldBe, symbols);
  });
  test("indent test", function() {
    var code, shouldBe, symbols;
    code = "say \"hi\"\nhow (are \"you doing?\")\n  very well (thank you)";
    symbols = lex(code);
    shouldBe = [["say", ["string", "hi"]], ["how", ["are", ["string", "you doing?"]], ["very", "well", ["thank", "you"]]]];
    return equalish(shouldBe, symbols);
  });
  test("indent test 2", function() {
    var code, shouldBe, symbols;
    code = "say \"hi\"\nhow (are \"you doing?\")\n  very well (thank you)\nand back out";
    symbols = lex(code);
    shouldBe = [["say", ["string", "hi"]], ["how", ["are", ["string", "you doing?"]], ["very", "well", ["thank", "you"]]], ["and", "back", "out"]];
    return equalish(shouldBe, symbols);
  });
  return fin();
  test("should parse with special string syntax", function() {
    var code, shouldBe, str, symbols;
    code = "set mystr \"\"\"\n  this is a multi line string\n  it can have anything \n";
    str = "this is a multi line string\nit can have anything ";
    symbols = lex(code);
    shouldBe = ["set", "mystr", str];
    return equalish(shouldBe, symbols);
  });
  fin();
}).call(this);
