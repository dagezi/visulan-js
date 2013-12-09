Model = require 'models/model'

module.exports = class Region extends Model
  initialize: (@world, {@width, @height, @left, @top}) ->

  # Try to match
  # matcher object, which contains matched subregions
  # subregions must not intersect with each other
  match: (pattern)->

  # Replace with other reigion
  # The width and height should be same
  replaceWith: (region)->

  # copy to new region. Its world will be recreated
  copy: ()->
        
  # create new region from intetersecion with another
  # another region must share world.
  intersects: (region)->
