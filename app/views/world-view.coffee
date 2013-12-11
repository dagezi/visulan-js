Color = require 'lib/color'
View = require './view'

module.exports = class WorldView extends View
  id: 'js-world-view'
  tagName: 'canvas'

  initialize: ({@model}) ->
    super

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

