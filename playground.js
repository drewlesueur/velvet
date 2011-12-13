z("set")("incMazer")(
  z("set")("x",0) ,    
  z("set-fn")("inc",
    z("set")( "x", z("x.add")(1))
    z("x")
  ),
  z("inc")
);


z("set-fn", "incMaker",
  z("set", "x", 0),
  z("set-fn", "inc",
    z("set", "x", z("x.add", 1)  ) 
    z("x")
  ),
  z("inc")
)

z("#", "result.body.texts[lower(x)].date");
z("result")("body")("texts")(z("lower", z("x")))("date");
z("result")("body")("texts")(z("lower")(z("x")))("date");
z(z("result.body.texts", z("lower", z("x"))), "date")

z("result", "body", "texts", z("lower", z("x")), "date")
z("set", "result", "body", "texts", "3",   "value")
z("band", "members")
z("set", "band", "members", 0, "Andrea")
z("set", "band", "members", 1, "Hector")

//set
result.body.texts[lower(x)].save("now", lower(y)).date
z("result")("body")("texts")(z("lower")(z("x")))("save")("now", z("lower")(z("x")))("date")
z("result", "body", "texts", z("lower", z("x")), "save", z(",", "now", z("lower", z("y"))), "date")
z("result", "body", "texts", z("lower", z("x")), "save", z(",", "now", z("lower", z("y"))), "date")

z("result.body.texts", z("lower",z("x")),"save", l("now", z("lower", z("y"))), "date")

c(g(g(g(g("result"), "body"), "texts"), "save"), 1, 2)

c("result.body.save", a(1, 2))
g("result", "body", "save", a(1, 2))
s("result", "body", "find", f("arg1 arg2",
  c("save", g("arg1"))
))

z("for", "i", "0", "100",
   z("print", z("i"))   
)

z("result", "body", "set", z(",", "texts", z("[]")))
z("result", "body", "set", a("texts", a()))
z("set", "result", "body", "texts", a())

z("result")("body")("set")("texts", z("[]"))

z("result.body.set", "texts", z("[]"))

z("set", "result", "body", "texts", z("[]"))
z("set", "result.body.texts", z("[]"))


z("set", "a", f(
        
))


s("a", f())


g("a")

// set, get, object, array, function, call?, do

s("incMaker", f(
  s("x", 0),
  s("inc", f(
    s("x", g("x", "+", 1)),
    g("x")
  )),
  g("inc")
))

s("inc", c("incMaker")),
c("incMaker")

g("obj", "property", "save", a())
c("print", "hello", g("name"))


var incMaker = function () {
  var x = 0;
  var inc = function () {
    x += 1;
    return x;
  };
  return inc;
};

incMaker = ->
  x = 0
  inc = ->
    x += 1
    x
  inc

z("set-fn", "incMaker",
  z("set", "x", 0),
  z("set-fn", "inc",
    z("set", "x", z("x.add", 1)  ) 
    z("x")
  ),
  z("inc")
)

d(
      
    
)
