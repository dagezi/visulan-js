application = require 'application'

module.exports = class Router extends Backbone.Router
  routes:
    '': 'home'
    'pattern/:pattern': 'home'

  home: (pattern)->
    application.world.initWith pattern if pattern
    $('body').html application.homeView.render().el
