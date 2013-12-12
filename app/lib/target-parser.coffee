Region = require 'models/region'

module.exports = class TargetParser

  headerRegexp = /c__+_c/g
  header1Regexp = /^_cc+c_$/
  bodyRegexp = /^_c.+c_$/
  tail0Regexp = header1Regexp
  tail1Regexp = /^c__+_c$/

  minHeight = 5;
  minWidth = 5;

  match: (region)->
    for y in [0 .. region.height - minHeight]
      row = region.getRow(y)
      headerRegexp.lastIndex = 0
      while (m = headerRegexp.exec(row))
        subregion = region.getSubregion m[0].length, region.height - y, m.index, y
        targetRegion = @submatch subregion
        return targetRegion if targetRegion

        # Pattern must not be exclusive
        headerRegexp.lastIndex = m.index + 1
    null

  submatch: (region)->
    return false unless header1Regexp.exec(region.getRow(1))

    y = 2
    while y < region.height - 1 and bodyRegexp.exec(region.getRow(y))
      y = y + 1
    # It's tricky but the bottom border matches bodyRegexp, too.
    if tail0Regexp.exec(region.getRow(y - 1)) and tail1Regexp.exec(region.getRow(y))
      return region.getSubregion region.width - 4, y - 3, 2, 2
    null     
    
