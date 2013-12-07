View = require './view'
World = require 'models/world'
WorldView = require './world-view'
template = require './templates/home'

module.exports = class HomeView extends View
  id: 'home-view'
  template: template

  initialize: ->
    super
    @world = new World height: 50, width: 100
    @worldView = new WorldView model: @world

  render: ->
    el = super
    @$('#js-visulan-slot').html @worldView.render().el
    el
