_ = require "underscore"
drews = require "drews-mixins"
{test, ok, eq, fin, equalish} = drews.testing

velvet = require "./velvet.coffee"
#console.log "VELVET IS #{velvet}"

{lex, compile} = velvet
test "should parse simple parenthetical", ->
  code = """
    (say hi)
  """
  symbols = lex code
  shouldBe = [["say", "hi"]]
  equalish shouldBe, symbols

test "should parse nested parenthetical", ->
  code = """
    (say (hi how are you) (doing))
  """
  symbols = lex code
  shouldBe = [["say", ["hi", "how", "are", "you"], ["doing"]]]
  equalish shouldBe, symbols

test "should parse with strings", ->
  code = """
    (say "hi")
    (how (are "you doing?"))
  """
  symbols = lex code
  shouldBe = [
    ["say", ["string", "hi"]]
    ["how", ["are", ["string", "you doing?"]]]
  ]
  equalish shouldBe, symbols

test "simple with multiline", ->
  code = """
    (say "hi")
    (how (are
    
        "you doing?"))
  """
  symbols = lex code
  shouldBe = [
    ["say", ["string", "hi"]]
    ["how", ["are", ["string", "you doing?"]]]
  ]
  equalish shouldBe, symbols

test "should use optional indent syntax", ->
  return ok true
  code = """
   use_indent
   say "hi"
   how (are "you doing")
     very well (thank you)
  """
  symbols = lex code
  shouldBe = [
    ["say", ["string", "hi"]]
    ["how", ["are", ["string", "you doing?"]], "very", "well", ["thank", "you"]]
  ]

test "should parse with special string syntax", ->
  ok true

fin()
