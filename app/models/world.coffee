Model = require 'models/model'

module.exports = class World extends Model
  initialize: ({@width, @height}) ->
    row = new Array(@width + 1).join('0')

    @board = (row for i in [0..@height - 1])

  getSym: (y, x)->
    @board[y][x]

  setSym: (y, x, sym)->
    row = @board[y]
    @board[y] = row.slice(0, x) + sym + row.slice(x + 1)
