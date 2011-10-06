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

    startParens() #start implicit parens
    for chr in code
      if state is "newline"
        if chr is " "
          newLineIndentWidth += 0.5
        else if chr is "\n"
          newLineIndentWidth = 0
        else if chr isnt " "
          console.log """
            yay got here!!
            indentWidth = #{indentWidth}
            newLineIndentWidth = #{newLineIndentWidth}
          """
          # close as many parens as you need to
          if newLineIndentWidth <= indentWidth
            closeCount = indentWidth - newLineIndentWidth + 1
            console.log """

              closeCount is #{closeCount}
              indentWidth is #{indentWidth}
              newLineIndentWidth is #{newLineIndentWidth}
              chr is #{chr}
              *****$$$$$*****

            """
            for i in [0...closeCount]
              closeParens()
          else
            1

          indentWidth = newLineIndentWidth
          state = "func"
          startParens()
          inFunc()
      else if state is "func"
        inFunc()
      else if state is "quote"
        if not isQuoteChr() 
          addChr()
        else if isQuoteChr()
          closeQuote()

    closeValue()
    while funcStack.length > 0
      closeParens() #close implicit parens
      

    func
  velvet


