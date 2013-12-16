module.exports = Color =
  symbols: '_abcdefghijklmnopqrstuvwxyz'

  toColor: (sym)=>
    levels = [0, 160, 255]
    ix = Color.symbols.indexOf(sym)
    ix = 0 if sym < 0
    r = levels[(Math.floor(ix / 9))]
    g = levels[(Math.floor(ix / 3) % 3)]
    b = levels[ix % 3]
    "rgb(#{r},#{g},#{b})"
