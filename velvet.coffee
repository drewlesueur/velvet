# todo
# macros
# static scope // should it be static?
# interpolation

_ = require "underscore"
define ?= (args..., name, ret) -> module?.exports = ret()
define "velvet", () ->
  velvet = {}
  velvet.version = "0.0.1"
  
  isLiteral = (code) ->
    _.isString(code) or (parseFloat(code) == code)
  compileMacros = velvet.compileMacros = (code, scope = lib, debug) -> #this time code is an array
    #recursively demacroify 
    # and keep doing it until you get no macros left in the code
    if debug
      yoyo = 1
    if code is null
      return null 
    else if isLiteral code
      return code
    else if _.isArray code
      first = code[0]
      if _.isString first
        rest = code.slice(1)
        if first of scope.macros
          code = scope.macros[first] rest...
          while (not _.isEqual(code, code = compileMacros(code)))
            true
          return code
        else
          if _.isArray rest
            return [first, compileMacros(rest, scope)...]
          else
            return code
      else
        _.each code, (line, index) ->
          code[index] = compileMacros line, scope #scope will change? 
        return code


  parse = velvet.parse = (code) ->
    literalParens = 0
    parensStack = []
    inDot = false
    endedOnDotFunc = false
    setEndedOnDotFunc = (val) ->
      console.log val
      endedOnDotFunc = val
      if val
        console.log "endedOnDotFunc!!!"
        console.log JSON.stringify func
      else
        console.log "false!!"
    newLineIndentWidth = 0
    indentWidth = 0
    value = ""
    funcStack = []
    func = []

    state = "func"

    code = code.split ""
    addChr = -> value += chr
    isControlChr = -> 
      if chr.match(/[\(\)"\s\n\.]/g)
        true
      else
        false

    closeValue = ->
      if value.length > 0
        if inDot
          value = "'" + value
          inDot = false
          setEndedOnDotFunc true
        else
          setEndedOnDotFunc false
        func.push value
        value = ""
      else
        inDot = false

    closeQuote = ->
      func.push "'" + value
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

    checkEndedOnDotFunc = ->
      if endedOnDotFunc
        func = [func]
        endedOnDotFunc = false

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
    
    doDot = () ->
      closeValue()
      if func.length > 1
        func = [func]

    inFunc = () ->
      if not isControlChr() 
        addChr()
      else if chr is "\n"
        if literalParens is 0
          closeValue()
          state = "newline"
          newLineIndentWidth = 0
      else if chr is "."
        doDot()
        inDot = true
      else if chr is "("
        literalParens += 1 
        if value is ""
          parensStack.push("normal")
          startParens()
        else
          parensStack.push("dot")
          doDot()
      else if chr is ")"
        parensType = parensStack.pop()
        literalParens -= 1 
        if parensType is "normal"
          closeParens()
          setEndedOnDotFunc false
        else
          closeValue()
          setEndedOnDotFunc true
          

      else if isSpaceChr()
        #checkEndedOnDotFunc() 
        closeValue()
      else if isQuoteChr()
        #checkEndedOnDotFunc() 
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
  
  lib = velvet.lib = 
    list: (args, scope) ->
      args
    set_raw: ([a,b], scope) ->
      funcName = "set_raw"
      scope[a] = b
      return b
    get: (a, scope) ->
      funcName = "get"
      if a[0] == "'"
        return a.slice(1)
      return scope[a]; 
    string_remove: (a, scope) ->
      funcName = "string"
      return a; 
    do: (args, scope) ->
      funcName = "do"
      last = null
      return args[args.length - 1]
    add: (args) ->
      sum = 0
      for val in args
        sum += val - 0
      sum
    macro: (args, scope) ->
    comment: ->
    macros:
      func: ->
      macro: ->
      set: (x, y, scope) ->
        ["set_raw", "'" + x, y]
      swap: (x, y) -> #just a macro that returns a list of swapped
        ["list", y, x]
      same: (args...) ->
        arr = []
        for arg in args
          arr.push "'" + arg
        ["list", arr...]
      
      expand: ->
      

  indent = ""
  velvetEval = velvet.velvetEval = (code, scope = lib) ->
    log = (text, what) ->
      if not velvet.debug then return 
      if _.isFunction what
        what = what.toString()
      else
        what = JSON.stringify what

    indent += "----"
    expression = code
    log "original expression", expression
    
    last = null
    if _.isString(code)
      if code.match /^\d/
        return code - 0
      last = scope.get(code, scope) 
      # should i do ("variable") and ("string" "this is a string")
      # or ("get" "variable") and ("this is a string")
    else if expression[0] == "string" #TODO: this should be part of the macros
      last =  expression[1]
    else
      _.each expression, (item, j) ->
        expression[j] = velvetEval(item)
      
      log "new expression is", expression

      func = expression[0]
      log "func is", func
      args = expression.slice(1)
      log "args are", args
      if _.isString func
        return func # for now
      last = func(args, scope)

    log "returning", last

    indent = indent.substring(0, indent.length - 4)
    last
  
  run = velvet.run = (code, scope = {}) ->
    code = parse code 
    code = compileMacros code
    code.unshift("do")
    return velvetEval code

  parseCompile = velvet.parseCompile = (code, scope = {}) ->
    code = parse code 
    code = compileMacros code
    code.unshift("do")
    return code





  velvet
