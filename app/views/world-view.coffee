Color = require 'lib/color'
View = require './view'

module.exports = class WorldView extends View
  id: 'js-world-view'
  tagName: 'canvas'

  initialize: ({@model}) ->
    super
    @penColor = 'z'
    @mode = 'edit'  # edit/select/paste
    @selectionPivot = null
    @selectionOther = null

  events:
    "mousedown": "mouseDown"
    "mousemove": "mouseMove"
    # TODO: Support touch events

  render: ->
    super
    @multi = 8 # with small number, dots blur. I don't know why.
    @el.height = @model.height * @multi
    @el.width = @model.width * @multi
    @canvasCtx = @el.getContext('2d')
    @draw()
    @

  draw: ->
    for y in [0 ... @model.height]
      for x in [0 ... @model.width]
        sym = @model.getSym(x, y)
        @canvasCtx.fillStyle = Color.toColor(sym)
        @canvasCtx.fillRect x * @multi, y * @multi, (x + 1) * @multi, (y + 1) * @multi

    if @selectionPivot and @selectionOther
      left = Math.min(@selectionPivot[0], @selectionOther[0])
      right = Math.max(@selectionPivot[0], @selectionOther[0])
      top = Math.min(@selectionPivot[1], @selectionOther[1])
      bottom = Math.max(@selectionPivot[1], @selectionOther[1])
      width = right - left + 1
      height = bottom - top + 1

      @canvasCtx.strokeStyle = 'rgb(200,200,200)'
      @canvasCtx.strokeRect(left * @multi, top * @multi,
        width * @multi - 1, height * @multi - 1)
    
  putPixel: (x, y, sym)->
    @model.setSym x, y, sym
    @draw()

  setPenColor: (sym)->
    @penColor = sym

  setModeEdit: ()->
    @mode = 'edit'

  setModeSelect: ()->
    @mode = 'select'

  setModePaste: ()->
    @mode = 'paste'

  selectionStart: (x, y)->
    @selectionPivot = @selectionOther = [x, y]
    @draw()

  selectionChange: (x, y)->
    @selectionOther = [x, y]
    @draw()

  getCoordFromMouseEvent: (event)->
    [(event.offsetX / @multi) | 0,
     (event.offsetY / @multi) | 0]

  mouseDown: (event)->
    return unless event.which is 1
    [x, y] = @getCoordFromMouseEvent(event)
    if @mode == 'edit'
      @putPixel x, y, @penColor
    else if 'select'
      @selectionStart x, y

        
  mouseMove: (event)->
    return unless event.which is 1
    [x, y] = @getCoordFromMouseEvent(event)
    if @mode == 'edit'
      @putPixel x, y, @penColor
    else if 'select'
      @selectionChange x, y
