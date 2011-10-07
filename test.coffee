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


test "indent test", ->
  code = """
   say "hi"
   how (are "you doing?")
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


test "indent test 2", ->
  code = """
   say "hi"
   how (are "you doing?")
     very well (thank you)
   and back out
  """
  symbols = lex code
  shouldBe = [
    ["say", ["string", "hi"]]
    ["how", 
      ["are", ["string", "you doing?"]],
      ["very", "well", ["thank", "you"]]
    ]
    ["and", "back", "out"]

  ]
  equalish shouldBe, symbols
        

test "should parse with special string syntax", ->
  code = """
    set mystr ""\"
      this is a multi line string
        it can have anything
      yea
    something else
    
  """
  str = """
    this is a multi line string
      it can have anything
    yea
  """
  symbols = lex code
  shouldBe = [
    ["set", "mystr", ["string", str]]
    ["something", "else"]
  ]
  equalish shouldBe, symbols


fin()
