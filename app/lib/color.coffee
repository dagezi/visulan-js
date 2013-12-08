module.exports =
  toColor: (sym)->
    ix = '_abcdefghijklmnopqrstuvwxyz'.indexOf(sym)
    ix = 0 if sym < 0
    r = (Math.floor(ix / 9)) * 127
    g = (Math.floor(ix / 3) % 3) * 127
    b = (ix % 3) * 127
    "rgb(#{r},#{g},#{b})"
