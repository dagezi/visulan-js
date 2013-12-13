World = require 'models/world'
Pattern = require 'models/pattern'
Pair = require 'models/pair'

View = require 'views/view'
WorldView = require 'views/world-view'
PalletView = require 'views/pallet-view'
template = require 'views/templates/home'

module.exports = class HomeView extends View
  id: 'home-view'
  template: template

  events:
    "click #js_play": "play"
    "click #js_pause": "pause"
    "click #js_link": "showLink"

  initialize: ({@world})->
    super
    @worldView = new WorldView model: @world
    @palletView = new PalletView

    @wholeRegion = @world.getWholeRegion()

    @isPlaying = false
  
  render: ->
    super
    @$('#js-pallet-container').html @palletView.render().el
    @$('#js-visulan-slot').html @worldView.render().el
    @palletView.on 'pickColor', @pickColor
  
    @setIsPlaying @isPlaying

    @on "playingState", @setIsPlaying

    @

  setIsPlaying: (v) ->
    @isPlaying = v
    @$('#js_play').prop('disabled', v)
    @$('#js_pause').prop('disabled', not v)

  play: ->
    @trigger('play')

  pause: ->
    @trigger('pause')
    
  showLink: ->
    link = location.protocol + "//"
    link += location.host or ""
    link += location.pathname or ""
    link += '#comp/' + @world.getCompressedData()

    @$('#js-link-text').toggle()
    @$('#js-link-text').text(link)


  pickColor: (sym) =>
    console.log sym
    @worldView.setPenColor(sym)
