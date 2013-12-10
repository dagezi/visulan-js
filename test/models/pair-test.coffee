World = require 'models/world'
Pattern = require 'models/pattern'
Pair = require 'models/pair'
MatchResult = require 'models/match-result'

describe 'Pair', ->
  beforeEach ->
    pattern = new Pattern ['a ']
    afterWorld = new World height: 2, width: 2
    afterWorld.initWith ' a a'
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

      expect(region.getRow(0)).to.be ' a a'
      expect(region.getRow(1)).to.be ' a b'



  
