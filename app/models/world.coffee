Model = require 'models/model'

module.exports = class World extends Model
  initialize: ({@width, @height}) ->
    row = new Array(@width + 1).join('_')

    @board = (row for i in [0..@height - 1])

  initWith: (pattern)->
    for y in [0 .. @height - 1]
      row = pattern.slice(y * @width, (y + 1) * @width)
      row = row + @board[y].slice(row.length)
      @board[y] = row

  getSym: (y, x)->
    @board[y][x]

  setSym: (y, x, sym)->
    row = @board[y]
    @board[y] = row.slice(0, x) + sym + row.slice(x + 1)
