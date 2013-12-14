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
    if @top <= region.top
      y = 0
      end = @height
      step = 1
    else
      y = @height - 1
      end = -1
      step = -1
    # No need to worry about horizontal overlap
    while y != end
      row = @world.board[@top + y]
      oRow = region.getRow(y)
      row = row.slice(0, @left) + oRow + row.slice(@left + @width)
      @world.board[@top + y] = row
      y = y + step

  # clone to new region. Its world will be recreated
  clone: ()->
        
  right: ->
    @left + @width

  bottom: ->
    @top + @height

  # create new region from intetersecion with another
  # another region must share world.
  intersect: (region)->
    return null if @world != region.world
      
    newTop = Math.max(@top, region.top)
    newLeft = Math.max(@left, region.left)
    newBottom = Math.min(@bottom(), region.bottom())
    newRight = Math.min(@right(), region.right())
    if newTop < newBottom and newLeft < newRight
      @world.getRegion(newRight - newLeft, newBottom - newTop, newLeft, newTop)
    else
      null
