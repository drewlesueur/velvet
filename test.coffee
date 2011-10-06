_ = require "underscore"
drews = require "drews-mixins"
{test, ok, eq, fin, equalish} = drews.testing

velvet = require "./velvet.coffee"

{lex, compile, run} = velvet

test "should parse simple parenthetical", ->
  code = """
    say hi
  """
  symbols = lex code
  shouldBe = [["say", "hi"]]
  equalish shouldBe, symbols

test "should parse nested parenthetical", ->
  code = """
    say (hi how are you) (doing)
  """
  symbols = lex code
  shouldBe = [["say", ["hi", "how", "are", "you"], ["doing"]]]
  equalish shouldBe, symbols


test "should parse with strings", ->
  code = """
    say "hi"
    how (are "you doing?")
  """
  symbols = lex code
  shouldBe = [
    ["say", ["string", "hi"]]
    ["how", ["are", ["string", "you doing?"]]]
  ]
  equalish shouldBe, symbols


test "simple with multiline", ->
  code = """
    say "hi"
    how (are 

      "you doing?")
  """
  symbols = lex code
  shouldBe = [
    ["say", ["string", "hi"]]
    ["how", ["are", ["string", "you doing?"]]]
  ]
  equalish shouldBe, symbols

return fin()
# left off here

test "indent test", ->
  code = """
   say "hi"
   how (are "you doing")
     very well (thank you)
  """
  symbols = lex code
  shouldBe = [
    ["say", ["string", "hi"]]
    ["how", 
      ["are", ["string", "you doing?"]],
      ["very", "well", ["thank", "you"]]
    ]
  ]
  equalish shouldBe, symbols
        
test "should parse with special string syntax", ->
  code = """
    set mystr ""\"
      this is a multi line string
      it can have anything 
    
  """
  str = """
    this is a multi line string
    it can have anything 
  """
  symbols = lex code
  shouldBe = ["set", "mystr", str]
  equalish shouldBe, symbols


fin()
