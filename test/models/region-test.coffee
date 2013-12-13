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

  describe '#intersect', ->
    it 'should calculate right intersection', ->
      region0 = @world.getRegion(5, 5, 0, 0)
      region1 = @world.getRegion(4, 5, 1, 3)
      intersection = region0.intersect region1
      expect(intersection.width).to.be 4
      expect(intersection.height).to.be 2

      # it's commutive
      intersection = region1.intersect region0
      expect(intersection.width).to.be 4
      expect(intersection.height).to.be 2

    it 'should return null', ->
      region0 = @world.getRegion(5, 5, 0, 0)
      region1 = @world.getRegion(5, 5, 0, 5)
      expect(region0.intersect region1).to.be null
