# The application bootstrapper.
module.exports = class Application
  initialize: ->
    HomeView = require 'views/home-view'
    Router = require 'lib/router'
    World = require 'models/world'
    # Ideally, initialized classes should be kept in controllers & mediator.
    # If you're making big webapp, here's more sophisticated skeleton
    # https://github.com/paulmillr/brunch-with-chaplin
    @world = new World height: 50, width: 100
    @homeView = new HomeView world: @world

    # Instantiate the router
    @router = new Router()
    # Freeze the object
    Object.freeze? this
