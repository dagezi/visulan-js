Color = require 'lib/color'
View = require './view'

module.exports = class WorldView extends View
  id: 'js-world-view'
  tagName: 'canvas'

  initialize: ({@model}) ->
    super
    @penColor = 'z'

  events:
    "mousedown": "drawPixel"
    "mousemove": "drawPixel"

  render: ->
    super
    @multi = 8 # with small number, dots blur. I don't know why.
    @el.height = @model.height * @multi
    @el.width = @model.width * @multi
    @canvasCtx = @el.getContext('2d')
    @canvasCtx.imageSmoothingEnabled = false
    @draw()
    @

  draw: ->
    for y in [0 ... @model.height]
      for x in [0 ... @model.width]
        sym = @model.getSym(x, y)
        @canvasCtx.fillStyle = Color.toColor(sym)
        @canvasCtx.fillRect x * @multi, y * @multi, (x + 1) * @multi, (y + 1) * @multi

  
  drawPixel: (event)->
    return unless event.which is 1
    x = (event.offsetX / @multi) | 0
    y = (event.offsetY / @multi) | 0
    @model.setSym x, y, @penColor
    @draw()

  setPenColor: (sym)->
    @penColor = sym
