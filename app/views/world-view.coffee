Color = require 'lib/color'
View = require './view'

module.exports = class WorldView extends View
  id: 'js-world-view'
  tagName: 'canvas'

  initialize: ({@model}) ->
    super

  render: ->
    super
    @canvasCtx = @el.getContext('2d')
    @draw()
    @

  draw: ->
    cellWidth = 5
    cellHeight = 5
    for y in [0 ... @model.height]
      for x in [0 ... @model.width]
        sym = @model.getSym(x, y)
        @canvasCtx.fillStyle = Color.toColor(sym)
        @canvasCtx.fillRect cellWidth * x, cellHeight * y,
          cellWidth * (x + 1), cellHeight * (y + 1)

