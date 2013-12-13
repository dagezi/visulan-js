# The application bootstrapper.
module.exports = class Application
  initialize: ->
    HomeView = require 'views/home-view'
    Router = require 'lib/router'
    World = require 'models/world'
    PairParser = require 'lib/pair-parser'
    TargetParser = require 'lib/target-parser'

    # Ideally, initialized classes should be kept in controllers & mediator.
    # If you're making big webapp, here's more sophisticated skeleton
    # https://github.com/paulmillr/brunch-with-chaplin
    @world = new World height: 50, width: 100
    @wholeRegion = @world.getWholeRegion()

    @homeView = new HomeView world: @world
    @homeView.on 'play', @startPlay
    @homeView.on 'pause', @pause
 
    @pairParser = new PairParser()
    @targetParser = new TargetParser()

    # Instantiate the router
    @router = new Router()

  startPlay: =>
    @target = @targetParser.match @wholeRegion
    @pairs = @pairParser.match @wholeRegion

    console.log @target
    console.log @pairs

    @play() if @target and @pairs

  play: =>
    @intervalId = setInterval @progress, 500
    @homeView.trigger 'playingState', true

  pause: =>
    clearInterval @intervalId
    @homeView.trigger 'playingState', false

  progress: =>
    matches = []
    for pair in @pairs
      matches = matches.concat(pair.match(@target))

    match.execute() for match in matches
    @homeView.worldView.draw()
