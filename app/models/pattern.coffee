assert = require 'lib/assert'
Model = require 'models/model'

# TODO: supprot declaration.

module.exports = class Pattern extends Model
  initialize: (linePatterns) ->
    @regExps = (new RegExp ("^" + pat) for pat in linePatterns)
    @topRe = new RegExp linePatterns[0], "g"
    @width = linePatterns[0].length  # TODO: consider declaration
  
  @fromRegion: (region)->
    new Pattern (region.getRow(y) for y in [0...region.height])

  getHeight: ->
    @regExps.length

  getWidth: ->
    @width    

  # Try to match
  # matcher object, which contains matched subregions
  # subregions must not intersect with each other
  # TODO: add subregions argument to avoid collision.
  match: (region)->
    subregions = []
    for y in [0 .. region.height - @getHeight()]
      row = region.getRow(y)
      @topRe.lastIndex = 0
      while (m = @topRe.exec(row))
        # TODO: check if colides with other regions
        subregion = region.getSubregion @getWidth(), @getHeight(), m.index, y
        if @submatch(subregion)
          subregions.push(subregion)
        else
          # Pattern must not be exclusive
          @topRe.lastIndex = m.index + 1

    subregions

  submatch: (region)->
    assert region.height == @getHeight()
    for y in [1 ... region.height]
      return false unless @regExps[y].exec(region.getRow(y))
    return true
