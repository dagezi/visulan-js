World = require 'models/world'
Pattern = require 'models/pattern'
Pair = require 'models/pair'

View = require 'views/view'
WorldView = require 'views/world-view'
PalletView = require 'views/pallet-view'
template = require 'views/templates/home'

module.exports = class HomeView extends View
  id: 'home-view'
  template: template

  events:
    "click #js_play": "play"
    "click #js_pause": "pause"
    "click #js_link": "showLink"
    "click #js_select": "selectMdoe"
    "click #js_paste": "pasteMode"

  initialize: ({@world})->
    super
    @worldView = new WorldView model: @world
    @palletView = new PalletView
    @palletView.setColor('z')

    @wholeRegion = @world.getWholeRegion()

    @isPlaying = false
  
  render: ->
    super
    @$('#js-pallet-container').html @palletView.render().el
    @$('#js-visulan-slot').html @worldView.render().el
    @palletView.on 'pickColor', @pickColor

    @setIsPlaying @isPlaying

    @on "playingState", @setIsPlaying

    @

  setIsPlaying: (v) ->
    @isPlaying = v
    @$('#js_play').prop('disabled', v)
    @$('#js_pause').prop('disabled', not v)

  play: ->
    @trigger('play')

  pause: ->
    @trigger('pause')
    
  showLink: ->
    link = location.protocol + "//"
    link += location.host or ""
    link += location.pathname or ""
    link += '#comp/' + @world.getCompressedData()

    @$('#js-link-text').toggle()
    @$('#js-link-text').text(link)

  pickColor: (sym) =>
    console.log sym
    @worldView.setPenColor(sym)
    @worldView.setModeEdit()
    @$('.js-world-view-mode').removeClass('active')
    @palletView.setColor(sym)

  selectMdoe: ->
    @worldView.setModeSelect()
    @$('.js-world-view-mode').removeClass('active')
    @palletView.setColor(null)
    @$('#js_select').addClass('active')

  pasteMode: ()->
    @worldView.setModePaste()
    @$('.js-world-view-mode').removeClass('active')
    @palletView.setColor(null)
    @$('#js_paste').addClass('active')
