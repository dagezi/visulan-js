View = require 'views/view'
Color = require 'lib/color'

module.exports = class PalletView extends View
  id: 'js-pallet-view'
  tagName: 'canvas'

  events:
    'click' : 'choose'

  @syms: '_abcdefghijklmnopqrstuvwxyz'

  render: ->
    super
    @multi = 10 # with small number, dots blur. I don't know why.
    @el.height = 1 * @multi
    @el.width = 27 * @multi
    @canvasCtx = @el.getContext('2d')
    @draw()
    @

  draw: ->
   for x in [0 ... 27]
     @canvasCtx.fillStyle = Color.toColor(PalletView.syms.charAt(x))
     @canvasCtx.fillRect x * @multi, 0, (x + 1) * @multi, @multi
  
  choose: ->
    x = (event.offsetX / @multi) | 0
    @trigger "pickColor", PalletView.syms.charAt(x)
