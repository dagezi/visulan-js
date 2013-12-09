World = require 'models/world'
Region = require 'models/region'

describe 'Region', ->
  beforeEach ->
    @world = new World width: 5, height: 10

  describe '#getWholeRegion', ->
    it 'should have orignal size', ->
      region = @world.getWholeRegion()
      expect(region.width).to.be @world.width
      expect(region.height).to.be @world.height

  describe '#getRow', ->
    it 'should correct row', ->
      region = @world.getRegion(5, 5, 0, 0)
      @world.setSym(1, 1, 'a')
      expect(region.getRow(0)).to.be '_____'
      expect(region.getRow(1)).to.be '_a___'

  describe '#replaceWith', ->
    it 'should copy', ->
      region0 = @world.getRegion(5, 5, 0, 0)
      region1 = @world.getRegion(5, 5, 0, 5)
      @world.setSym(1, 1, 'a')
      region1.replaceWith(region0)
      expect(@world.checkSanity()).to.be true
      expect(@world.getSym(1, 6)).to.be('a')
      expect(region0.getRow(1)).to.be(region1.getRow(1))
