World = require 'models/world'
Pattern = require 'models/pattern'

describe 'Pattern', ->
  beforeEach ->
    @pattern = new Pattern ["aaa", "aaa", "bbb"]
    @simplePattern = new Pattern ["_"]

  describe '#initialize', ->
    it 'should generate expected height and width', ->
      expect(@pattern.getHeight()).to.be 3
      expect(@pattern.getWidth()).to.be 3

  describe '#match', ->
    it 'should match', ->
      world = new World height: 3, width: 3
      world.initWith "aaaaaabbb"
      region = world.getWholeRegion()
      regions = @pattern.match(region)
      expect(regions).to.have.length(1)
      expect(regions[0].top).to.be 0
      expect(regions[0].left).to.be 0
      expect(regions[0].width).to.be 3
      expect(regions[0].height).to.be 3

    it 'should not match', ->
      world = new World height: 3, width: 3
      world.initWith "aaaaaabbc"
      region = world.getWholeRegion()
      regions = @pattern.match(region)
      expect(regions).to.have.length(0)

    it 'should match with backtrack', ->
      world = new World height: 3, width: 4
      world.initWith "aaaa" + "aaaa" + "abbb"
      region = world.getWholeRegion()
      regions = @pattern.match(region)
      expect(regions).to.have.length(1)
      expect(regions[0].left).to.be 1

    it 'subregions should not collide each other, but...', ->
      pattern = new Pattern ["aaa", "aaa"]
      world = new World height: 3, width: 3
      world.initWith "aaa" + "aaa" + "aaa"
      region = world.getWholeRegion()
      regions = pattern.match(region)

      # TODO: fix this!
      expect(regions).to.have.length(2)  # should 1!

    it 'should not match outside of region horizontally', ->
      world = new World height: 3, width: 4
      world.initWith "aaaa" + "aaaa" + "abbb"
      region = world.getRegion(3, 3, 0, 0)
      expect(@pattern.match(region)).to.have.length 0

    it 'should not match outside of region vertically', ->
      world = new World height: 4, width: 4
      world.initWith "____" + "aaaa" + "aaaa" + "abbb"
      region = world.getRegion(4, 3, 0, 0)
      expect(@pattern.match(region)).to.have.length 0

    it 'should not collide with other matches', ->
      world = new World height: 4, width: 4
      region = world.getRegion(4, 4, 0, 0)
      matchedRegions = [region]
      expect(@simplePattern.match(region, matchedRegions)).to.have.length 0

    it 'should match avoiding other matches', ->
      world = new World height: 4, width: 4
      region = world.getRegion(4, 4, 0, 0)
      matchedRegions = []
      matchedRegions.push world.getRegion(3, 4, 0, 0)
      matchedRegions.push world.getRegion(1, 2, 3, 1)
      matches = @simplePattern.match(region, matchedRegions)
      expect(matches).to.have.length 2
      expect(matches[0].width).to.be 1
      expect(matches[0].left).to.be 3
      expect(matches[1].width).to.be 1
      expect(matches[1].left).to.be 3

