module.exports = (expression, message)->
  throw message or "Assertion failed" unless expression
