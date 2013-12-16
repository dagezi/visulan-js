World = require 'models/world'
Pattern = require 'models/pattern'
Pair = require 'models/pair'
MatchResult = require 'models/match-result'

describe 'Pair', ->
  beforeEach ->
    pattern = new Pattern ['a ']
    afterWorld = new World height: 2, width: 2
    afterWorld.initWith ' c a'
    afterRegion = afterWorld.getRegion 2, 1, 0, 0
    
    @pair = new Pair pattern, afterRegion

  describe '#match', ->
    it 'should return enough data to replace', ->
      world = new World height: 2, width: 4
      world.initWith ('a a ' + 'a  b')
      region = world.getWholeRegion()

      matches = @pair.match(region)
      expect(matches).to.have.length 3
      expect(matches[0]).to.be.a MatchResult

      match.execute() for match in matches

      expect(region.getRow(0)).to.be ' c c'
      expect(region.getRow(1)).to.be ' c b'

    it 'should avoid collision with trivial exsiting matches', ->
      world = new World height: 2, width: 4
      world.initWith ('a a ' + 'a  b')
      region = world.getWholeRegion()
      matchedRegions = [region]

      expect(@pair.match region, matchedRegions).to.have.length 0


    it 'should avoid collision with exsiting matches', ->
      world = new World height: 2, width: 4
      world.initWith ('a a ' + 'a  b')
      region = world.getWholeRegion()
      matchedRegions = [
        world.getRegion(2, 1, 0, 1),
        world.getRegion(1, 2, 3, 0)]
            
      matches = @pair.match region, matchedRegions
      expect(matches).to.have.length 1

      match.execute() for match in matches

      expect(region.getRow(0)).to.be ' ca '
      expect(region.getRow(1)).to.be 'a  b'
