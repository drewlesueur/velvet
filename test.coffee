_ = require "underscore"
drews = require "drews-mixins"
{test, ok, eq, fin, equalish} = drews.testing

velvet = require "./velvet.coffee"
#console.log "VELVET IS #{velvet}"

{lex, compile, run} = velvet
test "should parse simple parenthetical", ->
  code = """
    no_indent
    (say hi)
  """
  symbols = lex code
  shouldBe = [["say", "hi"]]
  equalish shouldBe, symbols

test "should parse nested parenthetical", ->
  code = """
    no_indent
    (say (hi how are you) (doing))
  """
  symbols = lex code
  shouldBe = [["say", ["hi", "how", "are", "you"], ["doing"]]]
  equalish shouldBe, symbols

test "should parse with strings", ->
  code = """
    no_indent
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
    no_indent
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

test "variable assignment", ->
  code = """
    set band "Aterciopelados"
    band
  """
  band = run code
  eq band, "Aterciopelados"

test "defining a function", ->
  code = """
    setfn greeting ()
      "hello cosmic blue sphere" 
    greeting .
  """
  ret = run code
  eq ret, "hello cosmic blue sphere"


test "lexical scope"


test
fin()
