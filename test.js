(function() {
  var compile, drews, eq, equalish, fin, ok, parse, run, test, velvet, _, _ref;
  _ = require("underscore");
  drews = require("drews-mixins");
  _ref = drews.testing, test = _ref.test, ok = _ref.ok, eq = _ref.eq, fin = _ref.fin, equalish = _ref.equalish;
  velvet = require("velvet");
  parse = velvet.parse, compile = velvet.compile, run = velvet.run;
  test("should parse simple parenthetical", function() {
    var code, shouldBe, symbols;
    code = "say hi";
    symbols = parse(code);
    shouldBe = [["say", "hi"]];
    return equalish(shouldBe, symbols);
  });
  test("should parse nested parenthetical", function() {
    var code, shouldBe, symbols;
    code = "say (hi how are you) (doing)";
    symbols = parse(code);
    shouldBe = [["say", ["hi", "how", "are", "you"], ["doing"]]];
    return equalish(shouldBe, symbols);
  });
  test("should parse with strings", function() {
    var code, shouldBe, symbols;
    code = "say \"hi\"\nhow (are \"you doing?\")";
    symbols = parse(code);
    shouldBe = [["say", ["string", "hi"]], ["how", ["are", ["string", "you doing?"]]]];
    return equalish(shouldBe, symbols);
  });
  test("simple with multiline", function() {
    var code, shouldBe, symbols;
    code = "say \"hi\"\nhow (are \n\n  \"you doing?\")";
    symbols = parse(code);
    shouldBe = [["say", ["string", "hi"]], ["how", ["are", ["string", "you doing?"]]]];
    return equalish(shouldBe, symbols);
  });
  test("indent test", function() {
    var code, shouldBe, symbols;
    code = "say \"hi\"\nhow (are \"you doing?\")\n  very well (thank you)";
    symbols = parse(code);
    shouldBe = [["say", ["string", "hi"]], ["how", ["are", ["string", "you doing?"]], ["very", "well", ["thank", "you"]]]];
    return equalish(shouldBe, symbols);
  });
  test("indent test 2", function() {
    var code, shouldBe, symbols;
    code = "say \"hi\"\nhow (are \"you doing?\")\n  very well (thank you)\nand back out";
    symbols = parse(code);
    shouldBe = [["say", ["string", "hi"]], ["how", ["are", ["string", "you doing?"]], ["very", "well", ["thank", "you"]]], ["and", "back", "out"]];
    return equalish(shouldBe, symbols);
  });
  test("should parse with special string syntax", function() {
    var code, shouldBe, str, symbols;
    code = "set mystr \"\"\"\n  this is a multi line string\n    it can have anything\n  yea\nsomething else\n";
    str = "this is a multi line string\n  it can have anything\nyea";
    symbols = parse(code);
    shouldBe = [["set", "mystr", ["string", str]], ["something", "else"]];
    return equalish(shouldBe, symbols);
  });
  test("test some nesting", function() {
    var code, shouldBe, symbols;
    code = "band is object\n  name \"atericiopelados\"\n  started 1992\n  music_type \"rock\"\n  members list\n    \"Andrea Echeverri\" \n    \"Hector Buitrago\"\n  numbers list\n    1\n    2\n  other_numbers ilist 3 4\n  albums objx\n    first \"con el corazon\"\n    second \"another one\"\n  other_albums iobject blue \"oye\" pink \"gozo\"\nother_band is \"Julieta Venegas\"\n\n\n";
    symbols = parse(code);
    shouldBe = [["band", "is", "object", ["name", ["string", "atericiopelados"]], ["started", "1992"], ["music_type", ["string", "rock"]], ["members", "list", [["string", "Andrea Echeverri"]], [["string", "Hector Buitrago"]]], ["numbers", "list", ["1"], ["2"]], ["other_numbers", "ilist", "3", "4"], ["albums", "objx", ["first", ["string", "con el corazon"]], ["second", ["string", "another one"]]], ["other_albums", "iobject", "blue", ["string", "oye"], "pink", ["string", "gozo"]]], ["other_band", "is", ["string", "Julieta Venegas"]]];
    return equalish(shouldBe, symbols);
  });
  test("interpolate", function() {});
  test("just velvet Eval string", function() {
    var code, ret;
    code = ["string", "test"];
    ret = velvet.velvetEval(code);
    return eq(ret, "test");
  });
  test("just velvet Eval", function() {
    var code, ret;
    code = ["set", ["string", "x"], ["string", "hello world"]];
    ret = velvet.velvetEval(code);
    return eq(ret, "hello world");
  });
  test("set someting", function() {
    var code, ret;
    code = "set \"age\" \"test this out\"";
    ret = velvet.run(code);
    eq(ret, "test this out");
    return velvet.debug = false;
  });
  false && test("macro", function() {
    var code, ret;
    code = "set \"same\" (macro yo)\n";
    ret = velvet.run(code);
    return equalish(ret, ["the", "same", "as", "it", "came"]);
  });
  test("simple set", function() {
    var code, ret;
    code = "set \"name\" \"Drew\"";
    ret = velvet.run(code);
    return equalish(ret, "Drew");
  });
  test("set and get", function() {
    var code, ret;
    code = "set \"band\" \"Aterciopelados\"\nset \"grupo\" band";
    ret = velvet.run(code);
    return eq(ret, "Aterciopelados");
  });
  test("adding and nesting", function() {
    var code, ret;
    velvet.debug = true;
    code = "set \"sum\" (add 1 2)";
    ret = velvet.run(code);
    return eq(ret, 3);
  });
  fin();
}).call(this);
