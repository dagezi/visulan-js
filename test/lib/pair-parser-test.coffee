World = require 'models/world'
Region = require 'models/region'
PairParser = require 'lib/pair-parser'

describe 'PairParser', ->
  beforeEach ->
    @pairParser = new PairParser()

  it 'should not find false pair', ->
    world = new World width: 10, height: 10
    region = world.getWholeRegion()
    expect(@pairParser.match(region)).to.have.length 0

  it 'should find minimum pair', ->
    world = new World width: 7, height: 3
    data = '_ccccc_/_cdcsc_/_ccccc_'
    data = data.replace(/\//g, '')
    world.initWith data
    region = world.getWholeRegion()
    pairs = @pairParser.match(region) 
    expect(pairs).to.have.length 1
    pair = pairs[0]
    expect(pair.after.width).to.be 1
    expect(pair.after.height).to.be 1
    expect(pair.after.top).to.be 1
    expect(pair.after.left).to.be 4

  it 'should find pair', ->
    world = new World width: 9, height: 6
    data = '_ccccccc_/_cadcdsc_/_cadcccc_/_ccccdsc_/_cadcdsc_/_ccccccc_'
    data = data.replace(/\//g, '')
    world.initWith data
    region = world.getWholeRegion()
    pairs = @pairParser.match(region) 
    expect(pairs).to.have.length 1
    pair = pairs[0]
    expect(pair.after.width).to.be 2
    expect(pair.after.height).to.be 4
    expect(pair.after.top).to.be 1
    expect(pair.after.left).to.be 5

