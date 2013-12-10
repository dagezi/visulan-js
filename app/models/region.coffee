Model = require 'models/model'

module.exports = class Region extends Model
  initialize: (@world, {@width, @height, @left, @top}) ->

  getRow: (y)->
    @world.board[@top + y].slice(@left, @left + @width)

  getSubregion: (width, height, left, top)->
    # TODO: sanity check
    new Region @world,
      width: width
      height: height
      left: @left + left
      top: @top + top

  # Replace with other reigion
  # The width and height should be same
  replaceWith: (region)->
    if region.width != @width or region.height != @height
      console "replaceWith: not match: " + region.width + "x" + region.height
      return
    for y in [0 ... @height]
      row = @world.board[@top + y]
      oRow = region.getRow(y)
      row = row.slice(0, @left) + oRow + row.slice(@left + @width)
      @world.board[@top + y] = row

  # clone to new region. Its world will be recreated
  clone: ()->
        
  # create new region from intetersecion with another
  # another region must share world.
  intersects: (region)->
