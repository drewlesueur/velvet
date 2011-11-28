(function() {
  var compile, compileMacros, drews, eq, equalish, fin, ok, parse, run, test, velvet, _, _ref;
  _ = require("underscore");
  drews = require("drews-mixins");
  _ref = drews.testing, test = _ref.test, ok = _ref.ok, eq = _ref.eq, fin = _ref.fin, equalish = _ref.equalish;
  velvet = require("velvet");
  parse = velvet.parse, compile = velvet.compile, run = velvet.run, compileMacros = velvet.compileMacros;
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
    shouldBe = [["say", "'hi"], ["how", ["are", "'you doing?"]]];
    return equalish(shouldBe, symbols);
  });
  test("simple with multiline", function() {
    var code, shouldBe, symbols;
    code = "say \"hi\"\nhow (are \n\n  \"you doing?\")";
    symbols = parse(code);
    shouldBe = [["say", "'hi"], ["how", ["are", "'you doing?"]]];
    return equalish(shouldBe, symbols);
  });
  test("indent test", function() {
    var code, shouldBe, symbols;
    code = "say \"hi\"\nhow (are \"you doing?\")\n  very well (thank you)";
    symbols = parse(code);
    shouldBe = [["say", "'hi"], ["how", ["are", "'you doing?"], ["very", "well", ["thank", "you"]]]];
    return equalish(shouldBe, symbols);
  });
  test("indent test 2", function() {
    var code, shouldBe, symbols;
    code = "say \"hi\"\nhow (are \"you doing?\")\n  very well (thank you)\nand back out";
    symbols = parse(code);
    shouldBe = [["say", "'hi"], ["how", ["are", "'you doing?"], ["very", "well", ["thank", "you"]]], ["and", "back", "out"]];
    return equalish(shouldBe, symbols);
  });
  test("should parse with special string syntax", function() {
    var code, shouldBe, str, symbols;
    code = "set mystr \"\"\"\n  this is a multi line string\n    it can have anything\n  yea\nsomething else\n";
    str = "this is a multi line string\n  it can have anything\nyea";
    symbols = parse(code);
    shouldBe = [["set", "mystr", "'" + str], ["something", "else"]];
    return equalish(shouldBe, symbols);
  });
  test("test some nesting", function() {
    var code, shouldBe, symbols;
    code = "band is object\n  name \"atericiopelados\"\n  started 1992\n  music_type \"rock\"\n  members list\n    \"Andrea Echeverri\" \n    \"Hector Buitrago\"\n  numbers list\n    1\n    2\n  other_numbers ilist 3 4\n  albums objx\n    first \"con el corazon\"\n    second \"another one\"\n  other_albums iobject blue \"oye\" pink \"gozo\"\nother_band is \"Julieta Venegas\"\n\n\n";
    symbols = parse(code);
    shouldBe = [["band", "is", "object", ["name", "'atericiopelados"], ["started", "1992"], ["music_type", "'rock"], ["members", "list", ["'Andrea Echeverri"], ["'Hector Buitrago"]], ["numbers", "list", ["1"], ["2"]], ["other_numbers", "ilist", "3", "4"], ["albums", "objx", ["first", "'con el corazon"], ["second", "'another one"]], ["other_albums", "iobject", "blue", "'oye", "pink", "'gozo"]], ["other_band", "is", "'Julieta Venegas"]];
    return equalish(shouldBe, symbols);
  });
  test("interpolate", function() {});
  test("just velvet Eval string", function() {
    var code, ret;
    code = ["'test"];
    ret = velvet.velvetEval(code);
    return eq(ret, "test");
  });
  test("just velvet Eval", function() {
    var code, ret;
    code = ["set_raw", "'x", "'hello world"];
    ret = velvet.velvetEval(code);
    return eq(ret, "hello world");
  });
  test("set someting", function() {
    var code, ret;
    code = "set age \"test this out\"";
    ret = velvet.run(code);
    eq(ret, "test this out");
    return velvet.debug = false;
  });
  test("simple set", function() {
    var code, ret;
    code = "set name \"Drew\"";
    ret = velvet.run(code);
    return equalish(ret, "Drew");
  });
  test("set and get", function() {
    var code, ret;
    code = "set band \"Aterciopelados\"\nset grupo band";
    ret = velvet.run(code);
    return eq(ret, "Aterciopelados");
  });
  test("adding and nesting", function() {
    var code, ret;
    code = "set sum (add 1 2)";
    ret = velvet.run(code);
    return eq(ret, 3);
  });
  test("adding and nesting", function() {
    var code, ret;
    code = "set sum (add 1 (add 4 5))";
    ret = velvet.run(code);
    return eq(ret, 10);
  });
  test("compileMacros", function() {
    var code, ret;
    code = ["same", "as", "it", "came"];
    ret = compileMacros(code);
    return equalish(ret, ["list", "'as", "'it", "'came"]);
  });
  test("compileMacros where its not the first thing", function() {
    var code, ret;
    code = ["list", ["same", "as", "it", "came"]];
    ret = compileMacros(code, null, 1);
    return equalish(ret, ["list", ["list", "'as", "'it", "'came"]]);
  });
  test("macros that generate more macros that also compile", function() {
    var code, ret;
    code = ["swap", "ho", "hi"];
    ret = compileMacros(code);
    equalish(ret, ["list", "hi", "ho"]);
    code = ["swap", ["add", 100, 1], ["add", 1, 1]];
    ret = compileMacros(code);
    equalish(ret, ["list", ["add", 1, 1], ["add", 100, 1]]);
    code = ["swap", ["add", 100, 1], ["same", "yo", "hi"]];
    ret = compileMacros(code);
    return equalish(ret, ["list", ["list", "'yo", "'hi"], ["add", 100, 1]]);
  });
  test("built in macros", function() {
    var code, ret;
    code = "set values (same the same as it came)";
    return ret = velvet.run(code);
  });
  test("dot notation!", function() {
    var code, dropInventory, expectedResult, firstGamePlayer, gamePlayers, ret;
    return;
    code = "game.players.first.dropInventory(\"map\" \"keys\")";
    ret = parse(code);
    gamePlayers = ["game", "'players"];
    firstGamePlayer = [gamePlayers, "'first"];
    dropInventory = [firstGamePlayer, "'dropInventory"];
    expectedResult = [dropInventory, "'map", "'keys"];
    expectedResult = [expectedResult];
    console.log(JSON.stringify(ret));
    console.log(JSON.stringify(expectedResult));
    return equalish(ret, expectedResult);
  });
  test("dot notation 2", function() {
    var code, expected, ret;
    code = "a.b(1 2).c(3)\nd.e(4).f(5 6)\ng.h()\ni.j";
    expected = [[[[["a", "'b"], "1", "2"], "'c"], "3"], [[[["d", "'e"], "4"], "'f"], "5", "6"], [["g", "'h"]], ["i", "'j"]];
    ret = parse(code);
    return equalish(ret, expected);
  });
  test("dot notation 2.5", function() {
    var code, expected, ret, yy;
    return;
    yy = 1;
    code = "a.b stuff\na.b(1) \"stuff\"\n(a \"b\") \"stuff\"";
    expected = [[["a", "'b"], "stuff"], [[["a", "'b"], "1"], "'stuff"], [["a", "'b"], "'stuff"]];
    ret = parse(code);
    return equalish(ret, expected);
  });
  test("dot notation 3", function() {
    var code, expected, ret;
    code = "resource.get(100 200)\nresource.save(300)";
    expected = [[["resource", "'get"], "100", "200"], [["resource", "'save"], "300"]];
    ret = parse(code);
    return equalish(ret, expected);
  });
  test("compare dot notation and space notation", function() {
    var code, expected, ret;
    code = "a.b\na \"b\"";
    expected = [["a", "'b"], ["a", "'b"]];
    ret = parse(code);
    return equalish(ret, expected);
  });
  test("dot notation with intent", function() {
    var code, expected, ret;
    return;
    code = "a.b() c\n\na.b c\n\na.b\n  c\n\na.b()\n  c";
    expected = [[[["a", "'b"]], "c"], [["a", "'b"], "c"], [["a", "'b"], ["c"]], [[["a", "'b"]], ["c"]]];
    ret = parse(code);
    return equalish(ret, expected);
  });
  test("create a lookup function (object or hash)", function() {
    var code, ret;
    code = "set world object\n  sky \"cyan\"\n  grass \"green\"\n\nset grass = world \"grass\"";
    ret = velvet.velvetEval(code);
    return eq(ret, "green");
  });
  fin();
}).call(this);
