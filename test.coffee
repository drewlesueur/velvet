_ = require "underscore"
drews = require "drews-mixins"
{test, ok, eq, fin, equalish} = drews.testing

velvet = require "velvet"

{parse, compile, run} = velvet

test "should parse simple parenthetical", ->
  code = """
    say hi
  """
  symbols = parse code
  shouldBe = [["say", "hi"]]
  equalish shouldBe, symbols

test "should parse nested parenthetical", ->
  code = """
    say (hi how are you) (doing)
  """
  symbols = parse code
  shouldBe = [["say", ["hi", "how", "are", "you"], ["doing"]]]
  equalish shouldBe, symbols


test "should parse with strings", ->
  code = """
    say "hi"
    how (are "you doing?")
  """
  symbols = parse code
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
  symbols = parse code
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
  symbols = parse code
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
  symbols = parse code
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
  symbols = parse code
  shouldBe = [
    ["set", "mystr", ["string", str]]
    ["something", "else"]
  ]
  equalish shouldBe, symbols

test "test some nesting", () ->

  code = """
    band is object
      name "atericiopelados"
      started 1992
      music_type "rock"
      members list
        "Andrea Echeverri" 
        "Hector Buitrago"
      numbers list
        1
        2
      other_numbers ilist 3 4
      albums objx
        first "con el corazon"
        second "another one"
      other_albums iobject blue "oye" pink "gozo"
    other_band is "Julieta Venegas"



  """
  symbols = parse code
  shouldBe = [
    ["band", "is", "object",
      ["name", ["string", "atericiopelados"]],
      ["started", "1992"],
      ["music_type", ["string", "rock"]],
      ["members", "list",
        [["string", "Andrea Echeverri"]],
        [["string", "Hector Buitrago"]],
      ],
      ["numbers", "list"
        ["1"],
        ["2"]
      ],
      ["other_numbers", "ilist", "3", "4"],
      ["albums", "objx",
        ["first", ["string", "con el corazon"]],
        ["second", ["string", "another one"]],
      ],
      ["other_albums", "iobject", "blue", ["string", "oye"], "pink", ["string", "gozo"]]
    ],
    ["other_band", "is", ["string", "Julieta Venegas"]]
  ]
  equalish shouldBe, symbols

test "interpolate", () ->

test "just velvet Eval string", ->
  code = ["string", "test"]
  ret = velvet.velvetEval(code)
  eq ret, "test"

 
test "just velvet Eval", ->
  code = ["set", ["string", "x"], ["string", "hello world"]]
  ret = velvet.velvetEval(code)
  eq ret, "hello world"


test "set someting", () ->

  code = """
    set "age" "test this out"
  """
  ret = velvet.run code

  eq ret, "test this out"
  velvet.debug = false

test "macro", ->
  #TODO make this a macro test
  velvet.debug = true
  code = """
    set "same" (macro yo)
  """
  ret = velvet.run code
  equalish ret, ["the", "same", "as", "it", "came"] 



fin()
