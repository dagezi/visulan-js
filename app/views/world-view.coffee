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
    "mouseup": "mouseUp"
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
      region = @getRegion(@selectionPivot, @selectionOther)

      @canvasCtx.strokeStyle = 'rgb(200,200,200)'
      @canvasCtx.strokeRect(region.left * @multi, region.top * @multi,
        region.width * @multi - 1, region.height * @multi - 1)

  getRegion: (p0, p1)->
    left = Math.min(@selectionPivot[0], @selectionOther[0])
    right = Math.max(@selectionPivot[0], @selectionOther[0])
    top = Math.min(@selectionPivot[1], @selectionOther[1])
    bottom = Math.max(@selectionPivot[1], @selectionOther[1])
    width = right - left + 1
    height = bottom - top + 1

    @model.getRegion(width, height, left, top)
    
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

  paste: (x, y)->
    # TODO: consider tha case x, y in nearby bottom/right side
    sourceRegion = @getRegion(@selectionPivot, @selectionOther)
    destRegion = @model.getRegion(sourceRegion.width, sourceRegion.height, x, y)
    destRegion.replaceWith sourceRegion
    @draw()

  getCoordFromMouseEvent: (e)->
    if not e.offsetX is undefined
      x = e.offsetX
    else
      x = e.clientX - $(e.target).offset().left

    y = if not e.offsetY is undefined
          e.offsetY
        else
          e.clientY - $(e.target).offset().top

    [(x / @multi) | 0, (y / @multi) | 0]


  isButtonDown: (event)->
    if event.buttons == undefined
      event.which is 1
    else
      event.buttons is 1

  mouseDown: (event)->
    return unless @isButtonDown(event)
    [x, y] = @getCoordFromMouseEvent(event)
    switch @mode
      when 'edit'
        @putPixel x, y, @penColor
      when 'select'
        @selectionStart x, y
      when 'paste'
         @paintPivot = [x, y]
        
  mouseMove: (event)->
    return unless @isButtonDown(event)
    [x, y] = @getCoordFromMouseEvent(event)
    switch @mode
      when 'edit'
        @putPixel x, y, @penColor
      when 'select'
        @selectionChange x, y

  mouseUp: (event)->
    [x, y] = @getCoordFromMouseEvent(event)
    if @mode == 'paste' and x == @paintPivot[0] and y == @paintPivot[1]
      @paste x, y
      
