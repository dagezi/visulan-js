assert = require 'lib/assert'
Model = require 'models/model'

# A objects contains matching information
# Visulan finds all matches for all pairs then rewrites them.
# This class keeps information which will be utilized in rewrite phase.

module.exports = class MatchResult extends Model
  #  to match and destnation region
  # TODO: keep the information for Declaration
  initialize: (@dest, @replace)->
    assert @dest.width == @replace.width
    assert @dest.height == @replace.height

  # execute replacemente
  execute: ()->
    @dest.replaceWith @replace
