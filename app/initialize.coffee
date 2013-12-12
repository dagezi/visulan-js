Application = require 'application'

$ ->
  window.application = (new Application())
  application.initialize()
  Backbone.history.start()
