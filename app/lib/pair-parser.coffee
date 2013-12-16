Region = require 'models/region'
Pattern = require 'models/pattern'
Pair = require 'models/pair'

module.exports = class PairParser

  headerRegexp = /_c{5,}_/g
  bodyRegexp = /^_c.+c.+c_$/
  tailRegexp = /^_c+_$/

  minHeight = 3;
  minWidth = 7;

  match: (region)->
    pairs = []
    for y in [0 .. region.height - minHeight]
      row = region.getRow(y)
      headerRegexp.lastIndex = 0

      # TODO: Don't collide each other
      while (m = headerRegexp.exec(row)) and (m[0].length % 2) == 1
        subregion = region.getSubregion m[0].length, region.height - y, m.index, y
        pair = @submatch(subregion)
        pairs.push(pair) if pair
        headerRegexp.lastIndex = m.index + 1
               
    pairs

  submatch: (region)->
    patWidth = (region.width - 5) / 2
    for y in [1 ... region.height]
      row = region.getRow(y)
      m = bodyRegexp.exec(row)
      break unless m and m[0].charAt(patWidth + 2) == 'c'

    # getRow(y) is OOB or doesn't match bodyRegexp, which implies neither for tailRegexp
    return null unless y >= 3 and tailRegexp.exec(region.getRow(y - 1))

    patHeight = y - 2    
    pattern = Pattern.fromRegion(region.getSubregion patWidth, patHeight, 2, 1)
    after = region.getSubregion patWidth, patHeight, 3 + patWidth, 1

    new Pair(pattern, after)
