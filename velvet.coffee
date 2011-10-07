_ = require "underscore"
define = (args..., name, ret) -> module?.exports = ret()
define "velvet", () ->
  velvet = {}
  velvet.version = "0.0.1"
  velvet.lex = (code) ->
    literalParens = 0
    newLineIndentWidth = 0
    indentWidth = 0
    value = ""
    funcStack = []
    func = []

    state = "func"

    code = code.split ""
    addChr = -> value += chr
    removeLastChr = -> value = value.substring(0, value.length - 2)
    isControlChr = -> 
      if chr.match(/[\(\)"\s\n]/g)
        true
      else
        false

    closeValue = ->
      if value.length > 0
        func.push value
        value = ""

    closeQuote = ->
      func.push ["string", value]
      value = ""
      state = "func"

    startParens = () ->
      funcStack.push func
      func = []
      state = "func"

    closeParens = () ->
      closeValue()
      oldFunc = func
      func = funcStack.pop()
      if _.isArray(func)
        func.push oldFunc

    isSpaceChr = () ->
      if chr.match /\s/
        true

    isQuoteChr = () ->
      if chr.match /"/
        true

    threeQuotes = ->
      #called when there is already one quote
      chr is '"' and code[index + 1] is '"' and code[index + 2] is '\n'

    closeParensBasedOnIndent = ->
      closeCount = indentWidth - newLineIndentWidth + 1
      for i in [0...closeCount]
        closeParens()

    inNewLine = ->
      if chr is " "
        newLineIndentWidth += 0.5
      else if chr is "\n"
        newLineIndentWidth = 0
      else if chr isnt " "
        # close as many parens as you need to
        if newLineIndentWidth <= indentWidth
          closeParensBasedOnIndent()
        else
          1
        indentWidth = newLineIndentWidth
        state = "func"
        startParens()
        inFunc()

    inFunc = () ->
      if not isControlChr() 
        addChr()
      else if chr is "\n"
        if literalParens is 0
          state = "newline"
          newLineIndentWidth = 0
      else if chr is "("
        literalParens += 1 
        startParens()
      else if chr is ")"
        literalParens -= 1 
        closeParens()
      else if isSpaceChr()
        closeValue()
      else if isQuoteChr()
        state = "quote"

    inQuote = ->
      if threeQuotes() #keep in mind already in state quote
        index += 2 #skip over the last quote and carriage return
        state = "triple_quote"
      else if not isQuoteChr() 
        addChr()
      else if isQuoteChr()
        closeQuote()
    
    inTripleQuote = ->
      if chr is "\n"
        newLineIndentWidth = 0

      if chr is " " and newLineIndentWidth - indentWidth < 1
        newLineIndentWidth += 0.5

      else if (chr isnt "\n") and (chr isnt " ") and (newLineIndentWidth <= indentWidth)
        value = value.substring 0, value.length - 1
        closeQuote()
        closeParensBasedOnIndent()
        startParens()
        inFunc()
      else if chr is " " and (newLineIndentWidth <= indentWidth)
        1
      else
        addChr()

    startParens() #start implicit parens
    for chr, index in code
      if state is "newline"
        inNewLine()
      else if state is "func"
        inFunc()
      else if state is "quote"
        inQuote()
      else if state is "triple_quote"
        inTripleQuote()

    closeValue()
    while funcStack.length > 0
      closeParens() #close implicit parens

    func
  velvet


