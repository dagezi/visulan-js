Model = require 'models/model'
Region = require 'models/region'

module.exports = class World extends Model
  initialize: ({@width, @height}) ->
    row = new Array(@width + 1).join('_')

    @board = (row for i in [0 ... @height])

  initWith: (pattern)->
    for y in [0 ... @height]
      row = pattern.slice(y * @width, (y + 1) * @width)
      row = row + @board[y].slice(row.length)
      @board[y] = row

  initWithCompressed: (data)->
    base64 = data.replace(/\-/g,'+').replace(/\_/g,'/')
    @initWith LZString.decompressFromBase64(base64)

  getData: ->
    @board.join('')

  getCompressedData: ->
    raw = @getData()
    base64 = LZString.compressToBase64(raw)
    base64.replace(/\+/g,'-').replace(/\//g,'_')

  getSym: (x, y)->
    @board[y].charAt(x)

  setSym: (x, y, sym)->
    row = @board[y]
    @board[y] = row.slice(0, x) + sym + row.slice(x + 1)

  getRegion: (width, height, left, top) ->
    new Region(@, {width: width, height: height, left: left, top: top})

  getWholeRegion: ()->
    @getRegion(@width, @height, 0, 0)

  checkSanity: ()->
    @board.length == @height and _.every @board, (row)=> row.length == @width 

  
  
