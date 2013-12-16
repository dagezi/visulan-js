assert = require 'lib/assert'
Model = require 'models/model'
Region = require 'models/region'
Pattern = require 'models/pattern'
MatchResult = require 'models/match-result'

module.exports = class Pair extends Model
  initialize: (@pattern, @after) ->
    assert @pattern instanceof Pattern
    assert @after instanceof Region

  # Returns MatchResult.
  # Do not substibutate here
  match: (region, matchedRegions)->
    dests = @pattern.match region, matchedRegions
    (new MatchResult(dest, @after) for dest in dests)
