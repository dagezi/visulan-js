World = require 'models/world'
Region = require 'models/region'

describe 'World', ->
  beforeEach ->
    @world = new World width: 5, height: 10
  
  describe 'just after created', ->
    it 'has specified height', ->
      expect(@world.board.length).to.be 10
      expect(@world.board[0].length).to.be 5
      expect(@world.checkSanity()).to.be true

  describe '#initWith', ->
    beforeEach ->
      @world.initWith '_abcd_zzzz_j'

    it 'has init with given pattern', ->
      expect(@world.getSym(0, 0)).to.be '_'
      expect(@world.getSym(1, 0)).to.be 'a'
      expect(@world.getSym(4, 0)).to.be 'd'
      expect(@world.getSym(1, 1)).to.be 'z'
      expect(@world.getSym(4, 1)).to.be 'z'
      expect(@world.getSym(1, 2)).to.be 'j'
      expect(@world.getSym(2, 2)).to.be '_'
      expect(@world.getSym(0, 3)).to.be '_'

  describe '#setSym', ->
    it 'should change cell', ->
      @world.setSym 0, 0, 'z'
      expect(@world.getSym(0, 0)).to.be 'z'
      expect(@world.checkSanity()).to.be true

  describe '#getWholeRegion', ->
    it 'should create region with same size', ->
      region = @world.getWholeRegion()
      expect(region).to.be.a(Region)
      expect(region.height).to.be @world.height
      expect(region.width).to.be @world.width

  describe '#getData', ->
    it 'should return the data used for initWith', ->
      data = 'adpbcdefgdafdsaafpkafafdsasdlfdsc'
      data += new Array(50 - data.length + 1).join('_')
      @world.initWith data
      expect(@world.getData()).to.be data

  describe '#initWithCompressed and #getCompressedData', ->
    it 'should return the data used for initWith', ->
      data = 'adpbcdefgdafdsaafpkafafdsasdlfdsc'
      data += new Array(50 - data.length + 1).join('_')
      @world.initWith data

      compressed = @world.getCompressedData()
      expect(compressed.length).to.be.lessThan data.length
      console.log compressed

      newWorld = new World width: 5, height: 10
      newWorld.initWithCompressed compressed
      expect(newWorld.getData()).to.be data
