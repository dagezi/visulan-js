application = require 'application'

module.exports = class Router extends Backbone.Router
  routes:
    '': 'home'
    'pattern/:pattern': 'home'
    'comp/:compressed': 'homeWithComp'

  home: (pattern)->
    application.world.initWith pattern if pattern
    $('body').html application.homeView.render().el

  homeWithComp: (compressed)->
    application.world.initWithCompressed compressed
    $('body').html application.homeView.render().el
