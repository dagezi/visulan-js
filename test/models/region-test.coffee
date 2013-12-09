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


                 
