Model = require 'models/model'

module.exports = class World extends Model
  initialize: ({@width, @height}) ->
    row = new Array(@width + 1).join('0')

    @board = (row for i in [0..@height - 1])


    