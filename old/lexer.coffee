lexerate = (str) ->
  i = 0
  chr = ""
  tokens = []
  _state = "start"
  state = (arg) ->
    _state = arg
  stateIs = (arg) ->
    _state == arg
  value = ""
  token = ""
  lastIndent = 0
  indent = 0
  getChar = () ->
    chr = str.slice(i,i+1)
  isLetter = () ->
    chr.match /[A-Za-z_]/ 
  isNumber = () ->
    chr.match /[0-9]/
  addChr = () ->
    value += chr
  isSpace = () ->
    chr == " "
  isVar = () ->
    chr.match /[\w]/
  clearValue = () -> value = ""
  chrIs = (_chr) ->
    () ->
      chr == _chr
  isSymbol = () -> 
    "!@#$%^&*()-=+[]{}<>~`,.?/\\|".indexOf(chr) != -1

  checkIndent = ->
    indent % 1 == 0

  addToken  = () ->
    tokens.push _state, value
    
  while i < str.length
    getChar()

    if stateIs("newline")
      if isSpace()
        state "halfindent"

    elseif stateIs "halfindent"
      if isSpace()
        state "indent"
        clearValue() #jic
        addToken()


    if stateIs "start"
      if isLetter()
        state "variable"
        addChr()
      else if isNumber()
        state "number"
        addChr()
      else if isSpace()
        checkIndent()
      if isSymbol()
        state "symbol"
        addChr()
    else if stateIs "variable"
      if isVar()
        addChr()
      else if isSpace()
        addToken()
        clearValue()
        state "start"
      else if isReturn()
        addToken()
        clearValue()
        state "start"
      else if isSymbol()
        addToken()
        state "symbol"
        addChr()


    i += 1
  addToken _state, value
  tokens

tokens = lexerate """
  abcdef = 1
"""

console.log JSON.stringify tokens






        

