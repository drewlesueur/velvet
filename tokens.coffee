#TODO:
#  do indents and outdents
#  to spaces because `(test)(dis)`
#  does not equal `(test) (dis)`
#
tokenize = (inputString) ->
  prefix = "<>+-&"
  suffix = "=>&:"
  c = null
  from = null
  i = 0
  length = inputString.length
  numberValue = null
  str = ""
  quoteCharacter = null
  result = [] #tokens

  makeToken = (token, name) ->
    result.push make token, name

  getChr = () ->
    c = inputString.charAt(i)
  inc = () ->
    i += 1
  add = () ->
    str += c
  clear = () ->
    str = ""
  isLetter = () ->
    (c >= 'a' and c <= 'z') or (c >= 'A' and c <= 'Z')

  isNumber = () ->
    (c >= '0' and c <= '9')

  isE = () ->
    c == "e" or c == 'E'

  isPlusOrMinus = () ->
    c == "-" or c == '+'


  isOkInVariable = () ->
    isLetter() or (c >= '0' and c <= '9') or (c == '_')

  isQuote = () ->
    c == '\'' or c == '"'

  make = (type, value) ->
    type: type
    value: value
    from: from
    to: i
  
  getChr()

  while c
    from = i

    #ignore whitespace -> for now
    if c <= " "
      i += 1
      getChr()

    else if isLetter()
      clear()
      add()
      inc()
      while true
        getChr()
        if isOkInVariable()
          add()
          inc()
        else
          break
      makeToken "name", str
    else if isNumber()
      clear()
      add()
      inc()
      while true
        getChr()
        if not isNumber()
          break
        inc()
        add()
      if c == "."
        inc()
        add()
        while true
          getChr()
          if not isNumber()
            break
          inc()
          add()

      if isE()
        inc()
        add()
        getChr()
        if isPlusOrMinus()
          inc()
          add()
          getChr()
        if not isNumber()
          makeToken 'number', str #error bad exponent
        inc()
        add()
        getChr()
        while isNumber()
          inc()
          add()
          getChr()
      if isLetter()
        add()
        inc()
        makeToken 'number', str #bad number, is followed by letter
      makeToken 'number', str
    else if isQuote()
      clear()
      quoteCharacter = c
      inc()
      while true
        getChr()
        if c == quoteCharacter
          break
        if c == '\\'
          inc()
          if i >= length
            makeToken 'string', str #unterminated string length
          getChr()
          if c == 'u'
            if i >= length
              makeToken 'string', str #unterminated string length
              c = parseInt inputString.substr(i + 4, 4), 16
              c = String.fromCharCode(c)
              inc()
              inc()
              inc()
              inc()
              break
          else if c == "b"
            c = "\b"
          else if c == "f"
            c = "\f"
          else if c == "n"
            c = "\n"
          else if c == "r"
            c = "\r"
          else if c == "t"
            c = "\t"
        add()
        inc()
      inc()
      makeToken 'string', str
      getChr()
    else if c == '#'
      while true
        getChr()
        if c == '\n' or c == '\r' or c == ''
          break
        inc()
    else if prefix.indexOf(c) >= 0 
      clear()
      add()
      inc()
      while true
        getChr()
        if i >= length or suffix.indexOf(c) < 0
          break
        add()
        inc()
      makeToken 'operator', str
    else #single character operator
      inc()
      makeToken 'operator', c
      getChr()

  return result




str = """
  drew leseuru
  hello 12
  a = "one two three"
  b = four five six
  test_this = 'have some fun'
  another = (save some)(time)

"""

console.log JSON.stringify tokenize str
