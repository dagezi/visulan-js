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
      src = @world.getRegion(5, 4, 0, 0)
      dest = @world.getRegion(5, 4, 0, 5)
      @world.setSym(1, 1, 'a')
      @world.setSym(2, 4, 'b')
      dest.replaceWith(src)
      expect(@world.checkSanity()).to.be true
      expect(@world.getSym(1, 6)).to.be('a')
      expect(@world.getSym(2, 9)).to.be('_')
      expect(src.getRow(1)).to.be(dest.getRow(1))

    it 'should copy correctly to overlapped region above', ->
      src = @world.getRegion(5, 5, 0, 1)
      dest = @world.getRegion(5, 5, 0, 0)
      @world.setSym(4, 0, 'z')
      @world.setSym(1, 1, 'a')
      @world.setSym(2, 5, 'b')
      dest.replaceWith(src)
      expect(@world.checkSanity()).to.be true
      expect(@world.getSym(4, 0)).to.be('_')
      expect(@world.getSym(1, 0)).to.be('a')
      expect(@world.getSym(2, 4)).to.be('b')

    it 'should copy correctly to overlapped region below', ->
      src = @world.getRegion(5, 5, 0, 0)
      dest = @world.getRegion(5, 5, 0, 1)
      @world.setSym(1, 0, 'a')
      @world.setSym(2, 4, 'b')
      @world.setSym(3, 5, 'c')
      dest.replaceWith(src)
      expect(@world.checkSanity()).to.be true
      expect(@world.getSym(1, 1)).to.be('a')
      expect(@world.getSym(2, 5)).to.be('b')
      expect(@world.getSym(3, 5)).to.be('_')
      expect(@world.getSym(3, 6)).to.be('_')

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
