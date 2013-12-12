Application = require 'application'

$ ->
  window.application = (new Application()).initialize()
  Backbone.history.start()
