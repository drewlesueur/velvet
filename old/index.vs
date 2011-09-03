# varibles, assignment, strings, integers

age = 26
name = "aterciopelados"

# functions
say_hi = [name] ->
  print "hi #{name}"

say_hi "hector"

say_goodbye = {age, name} ->
 print "you are #{age} years old"
 print "goodbye #{name}"

say_goodbye name: "aterciopelados", age: ""

my_other_func = (args) ->


#parens
say_hi "hector"
say_hi("hector") are the same

say_hi capitalize "hector"
say_hi(capitalize("hector"))

# array literals
list = 1, 3, 4, 5
list = [1, 2, 3, 4, 5]
list =
  1
  2
  3
  4

list 0 # returns 1

#object listerals
obj = {a:1, b:2}
obj =
  a: 1
  b: 2
  c: 3

obj "a" #returns 1
obj.a # returns 1



#these are the same
obj.view.save "agr1"
obj("view")("save") "arg1"
((obj "view") "save") "arg1"

prop1 = "view"
func1 = "save"
obj(prop1)(func1) "arg1"

#these two are the same
person.name =  "sanders"
person "name", "sanders"


if eq x, b




#lexical scope just lke javascript


#bunch of coffescript shortcuts for async programming
#objects as keys


  



