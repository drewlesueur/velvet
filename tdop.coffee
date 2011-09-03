#scope/locals object
#arguments object

parse = (tokens) ->
  tokenIndex = -1

  info =
    op: (val="+") ->
      type: operator
      val: val

    id: (val) ->
      type: "identifier"
      value: val
      nud: -> val

    num: (val) ->
      type: "identifier"
      value: val
      nud: -> val

    add: () ->
      value: "+" 
      lbp: 10
      led: (left) ->
        right = expression(10)
        ["+", left, right]

  mul = () ->
    value: "*"
    lbp: 20
    led: (left) ->
      right = expression 20
      ["*", left, right]

  endToken = ->
    lbp: 0

  next = () ->
    tokenIndex += 1
    tokenType = tokens[tokenIndex].type
    tokenValue = tokens[tokenIndex].value
    token = info[tokenType] tokenValue
    token
  next()
      
  expression = (rbp=0) ->
    t = token
    token = next()
    left = t.nud()
    while rbp < token.lbp
      t = token
      token = next()
      left = t.led left
    left

  expression()



tokens = [
  , add(), num(6), mul(), num(7), add(), num(8)
]

console.log parse tokens

