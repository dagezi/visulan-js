World = require 'models/world'

describe 'World', ->
  beforeEach ->
    @world = new World width: 5, height: 10
  
  context 'just after created', ->
    it 'has secified height', ->
      expect(@world.board.length).to.be 10
      expect(@world.board[0].length).to.be 5

