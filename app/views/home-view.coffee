World = require 'models/world'
Pattern = require 'models/pattern'
Pair = require 'models/pair'

View = require 'views/view'
WorldView = require 'views/world-view'
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

    @wholeRegion = @world.getWholeRegion()
    # Hack!
    pattern = new Pattern ['z', '_']
    afterWorld = new World height: 2, width: 1
    afterWorld.initWith '_z'
    afterRegion = afterWorld.getRegion 1, 2, 0, 0
    
    @pair = new Pair pattern, afterRegion
  

  render: ->
    super
    @$('#js-visulan-slot').html @worldView.render().el
    @

  play: ->
    @intervalId = setInterval @progress, 500

  pause: ->
    clearInterval @intervalId
    
  showLink: ->
    console.log "link"

  progress: =>
    matches = @pair.match(@wholeRegion)
    match.execute() for match in matches
    @worldView.draw()
