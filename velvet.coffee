define ?= (args..., name, ret) -> module?.exports = ret()
define "velvet", () ->
  velvet = {}
  velvet.lex = (code) ->
    use_indent = false
    value = ""
    funcStack = []
    func = []

    state = "func"

    code = code.split ""
    addChr = -> value += chr
    isControlChr = -> 
      if chr.match(/[\(\)"\s]/g)
        true
      else
        false

    closeValue = ->
      if value.length > 0
        func.push value
        value = ""

      if func.length is 1 and func[0] is "use_indent"
        use_indent = true
        console.log """i
          yay, use indent is true
          !!!!!!!!!!!!!!!!!!!!!! 
        """

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
      func.push oldFunc

    isSpaceChr = () ->
      if chr.match /\s/
        true

    isQuoteChr = () ->
      if chr.match /"/
        true

    for chr in code
      if state is "func"
        if not isControlChr() 
          addChr()
        else if chr is "("
          startParens()
        else if chr is ")"
          closeParens()
        else if isSpaceChr()
          closeValue()
        else if isQuoteChr()
          state = "quote"
      else if state is "quote"
        if not isQuoteChr() 
          addChr()
        else if isQuoteChr()
          closeQuote()







    func
  velvet

