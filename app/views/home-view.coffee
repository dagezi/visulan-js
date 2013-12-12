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
    # Hack!
    pattern = new Pattern ['z', '_']
    afterWorld = new World height: 2, width: 1
    afterWorld.initWith '_z'
    afterRegion = afterWorld.getRegion 1, 2, 0, 0
    
    @pair = new Pair pattern, afterRegion
  
  render: ->
    super
    @$('#js-pallet-container').html @palletView.render().el
    @$('#js-visulan-slot').html @worldView.render().el
    @palletView.on 'pickColor', @pickColor

    @

  play: ->
    @intervalId = setInterval @progress, 500

  pause: ->
    clearInterval @intervalId
    
  showLink: ->
    location.hash = '#comp/' + @world.getCompressedData();

  progress: =>
    matches = @pair.match(@wholeRegion)
    match.execute() for match in matches
    @worldView.draw()

  pickColor: (sym) =>
    console.log sym
    @worldView.setPenColor(sym)
