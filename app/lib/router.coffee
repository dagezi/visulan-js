application = require 'application'

module.exports = class Router extends Backbone.Router
  routes:
    'pattern/:pattern': 'homeWithPattern'
    'comp/:compressed': 'homeWithComp'
    '': 'home'

  home: ->
    $('body').html application.homeView.render().el

  homeWithPattern: (pattern)->
    application.world.initWith pattern
    $('body').html application.homeView.render().el

  homeWithComp: (compressed)->
    application.world.initWithCompressed compressed
    $('body').html application.homeView.render().el
