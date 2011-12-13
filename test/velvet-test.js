describe("velvet", function () {
  var Velvet = dModule.require("velvet");
  var velvet, d, c, f, a, o, c2, s, g, _makeObj;

  beforeEach(function () {
    velvet = Velvet.init();
    d = velvet.d; c = velvet.c; f = velvet.f; a = velvet.a; o = velvet.o; c2 = velvet.c2; s = velvet.s; g = velvet.g;
    _makeObj = velvet._makeObj;
  });

  it("internal _makeObj should work", function () {
    var person = _makeObj("name", "Drew", "age", 27);
    expect(person("name").value).toBe("Drew")
    
    var team = _makeObj("worker", person)
    expect(team("worker")).toBe(person)

    person("color", "blue")
    expect(person("color").value).toBe("blue")

    var work = _makeObj("type", "hard")
    team(work, "not going to do it")
    expect(team(work).value).toBe("not going to do it")
  });

  it ("should set", function () {
    var ret = d(
      s("name", "Drew"),
      g("name")
    );
    expect(ret.value).toBe("Drew");
  });
    
});
