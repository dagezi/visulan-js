View = require 'views/view'
Color = require 'lib/color'

module.exports = class PalletView extends View
  id: 'js-pallet-view'
  tagName: 'canvas'

  events:
    'click' : 'choose'

  multi = 12 # with small number, dots blur. I don't know why.
  margin = 2

  render: ->
    super
    @el.height = 1 * multi + 2 * margin
    @el.width = multi * Color.symbols.length
    @canvasCtx = @el.getContext('2d')
    
    @draw()
    @

  draw: ->
   return unless @canvasCtx
   @canvasCtx.fillStyle = 'black'
   @canvasCtx.fillRect 0, 0, @el.width, @el.height
   if (typeof @colorIx) is "number"
     @canvasCtx.fillStyle = 'pink'
     @canvasCtx.fillRect @colorIx * multi, 0, multi, @el.height

   for x in [0 ... Color.symbols.length]
     @canvasCtx.fillStyle = Color.toColor(Color.symbols.charAt(x))
     @canvasCtx.fillRect x * multi, margin, multi, multi
  
  choose: (event)->
    x = (event.offsetX / multi) | 0
    @trigger "pickColor", Color.symbols.charAt(x)

  setColor: (sym)->
    if sym
      @colorIx = Color.symbols.indexOf(sym)
    else
      @colorIx = null
    @draw()
