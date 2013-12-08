View = require './view'
World = require 'models/world'
WorldView = require './world-view'
template = require './templates/home'

module.exports = class HomeView extends View
  id: 'home-view'
  template: template

  initialize: ({@world})->
    super
    @worldView = new WorldView model: @world

  render: ->
    super
    @$('#js-visulan-slot').html @worldView.render().el
    @
