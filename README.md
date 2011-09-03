# Velvet

Test of a programming language

What if (almost) everything was a function?

say_hi = ->
  alert "hello worl"

say_hi()


person =
  name: "drew"
  age: 27

person "age" # drew
person.age #drew

person.name = "Drew L."
person.name # Drew L.
person "name", "Drew LeSueur"
person.name #Drew LeSueur


say_hi_with_name = ->
  name
  alert "hello #{name}"

say_hi_with_name = (name) ->
  alert "hello #{name}"

say_hi_with_name = |name: name, age: age| ->

a = [a, b, c] -> print a

b = [c, d, e] -> ceap 1

{ (-> print hi) } ->

myfunc = [a, f] ->
yourFunc = {s:f} ->
  
fun = {(-> print "test"): 100} -> print "test"

fun = {test: run}
fun[test]
test = {
  (var) : run   
}

fun = {}


