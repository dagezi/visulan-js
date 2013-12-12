World = require 'models/world'
Region = require 'models/region'
TargetParser = require 'lib/target-parser'

describe 'TargetParser', ->
  beforeEach ->
    @targetParser = new TargetParser()

  it 'should not find false target', ->
    world = new World width: 10, height: 10
    region = world.getWholeRegion()
    expect(@targetParser.match(region)).to.be null

  it 'should find target', ->
    world = new World width: 8, height: 10
    data = 'c______c/_cccccc_/_cabdcc_/_cabdcc_/_cccccc_/c______c/'
    data = data.replace(/\//g, '')
    world.initWith data
    region = world.getWholeRegion()
    targetRegion = @targetParser.match(region)
    expect(targetRegion.width).to.be 4
    expect(targetRegion.height).to.be 2
    expect(targetRegion.top).to.be 2
    expect(targetRegion.left).to.be 2


  it 'should find target', ->
    world = new World width: 10, height: 10
    data = 'c__ckdc__c/ac______cz/d_cccccc_k/l_cabdcc_b/p_cabdcc_c/c_cccccc_d/ec______cf/'
    data = data.replace(/\//g, '')
    world.initWith data
    region = world.getWholeRegion()
    targetRegion = @targetParser.match(region)
    expect(targetRegion.width).to.be 4
    expect(targetRegion.height).to.be 2
    expect(targetRegion.top).to.be 3
    expect(targetRegion.left).to.be 3
