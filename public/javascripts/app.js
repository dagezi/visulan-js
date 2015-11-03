(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
var Application,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = Application = (function() {
  function Application() {
    this.progress = __bind(this.progress, this);
    this.pause = __bind(this.pause, this);
    this.play = __bind(this.play, this);
    this.startPlay = __bind(this.startPlay, this);
  }

  Application.prototype.initialize = function() {
    var HomeView, PairParser, Router, TargetParser, World;
    HomeView = require('views/home-view');
    Router = require('lib/router');
    World = require('models/world');
    PairParser = require('lib/pair-parser');
    TargetParser = require('lib/target-parser');
    this.world = new World({
      height: 50,
      width: 100
    });
    this.wholeRegion = this.world.getWholeRegion();
    this.homeView = new HomeView({
      world: this.world
    });
    this.homeView.on('play', this.startPlay);
    this.homeView.on('pause', this.pause);
    this.pairParser = new PairParser();
    this.targetParser = new TargetParser();
    return this.router = new Router();
  };

  Application.prototype.startPlay = function() {
    this.target = this.targetParser.match(this.wholeRegion);
    this.pairs = this.pairParser.match(this.wholeRegion);
    console.log(this.target);
    console.log(this.pairs);
    if (this.target && this.pairs) {
      return this.play();
    }
  };

  Application.prototype.play = function() {
    this.intervalId = setInterval(this.progress, 500);
    return this.homeView.trigger('playingState', true);
  };

  Application.prototype.pause = function() {
    clearInterval(this.intervalId);
    return this.homeView.trigger('playingState', false);
  };

  Application.prototype.progress = function() {
    var match, matchedRegions, matches, pair, _i, _j, _k, _len, _len1, _len2, _ref;
    matches = [];
    matchedRegions = [];
    _ref = this.pairs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pair = _ref[_i];
      matches = matches.concat(pair.match(this.target, matchedRegions));
      for (_j = 0, _len1 = matches.length; _j < _len1; _j++) {
        match = matches[_j];
        matchedRegions.push(match.dest);
      }
    }
    for (_k = 0, _len2 = matches.length; _k < _len2; _k++) {
      match = matches[_k];
      match.execute();
    }
    return this.homeView.worldView.draw();
  };

  return Application;

})();
});

;require.register("initialize", function(exports, require, module) {
var Application;

Application = require('application');

$(function() {
  window.application = new Application();
  application.initialize();
  return Backbone.history.start();
});
});

;require.register("lib/assert", function(exports, require, module) {
module.exports = function(expression, message) {
  if (!expression) {
    throw message || "Assertion failed";
  }
};
});

;require.register("lib/color", function(exports, require, module) {
var Color,
  _this = this;

module.exports = Color = {
  symbols: '_abcdefghijklmnopqrstuvwxyz',
  toColor: function(sym) {
    var b, g, ix, levels, r;
    levels = [0, 160, 255];
    ix = Color.symbols.indexOf(sym);
    if (sym < 0) {
      ix = 0;
    }
    r = levels[Math.floor(ix / 9)];
    g = levels[Math.floor(ix / 3) % 3];
    b = levels[ix % 3];
    return "rgb(" + r + "," + g + "," + b + ")";
  }
};
});

;require.register("lib/pair-parser", function(exports, require, module) {
var Pair, PairParser, Pattern, Region;

Region = require('models/region');

Pattern = require('models/pattern');

Pair = require('models/pair');

module.exports = PairParser = (function() {
  var bodyRegexp, headerRegexp, minHeight, minWidth, tailRegexp;

  function PairParser() {}

  headerRegexp = /_c{5,}_/g;

  bodyRegexp = /^_c.+c.+c_$/;

  tailRegexp = /^_c+_$/;

  minHeight = 3;

  minWidth = 7;

  PairParser.prototype.match = function(region) {
    var m, pair, pairs, row, subregion, y, _i, _ref;
    pairs = [];
    for (y = _i = 0, _ref = region.height - minHeight; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      row = region.getRow(y);
      headerRegexp.lastIndex = 0;
      while ((m = headerRegexp.exec(row)) && (m[0].length % 2) === 1) {
        subregion = region.getSubregion(m[0].length, region.height - y, m.index, y);
        pair = this.submatch(subregion);
        if (pair) {
          pairs.push(pair);
        }
        headerRegexp.lastIndex = m.index + 1;
      }
    }
    return pairs;
  };

  PairParser.prototype.submatch = function(region) {
    var after, m, patHeight, patWidth, pattern, row, y, _i, _ref;
    patWidth = (region.width - 5) / 2;
    for (y = _i = 1, _ref = region.height; 1 <= _ref ? _i < _ref : _i > _ref; y = 1 <= _ref ? ++_i : --_i) {
      row = region.getRow(y);
      m = bodyRegexp.exec(row);
      if (!(m && m[0].charAt(patWidth + 2) === 'c')) {
        break;
      }
    }
    if (!(y >= 3 && tailRegexp.exec(region.getRow(y - 1)))) {
      return null;
    }
    patHeight = y - 2;
    pattern = Pattern.fromRegion(region.getSubregion(patWidth, patHeight, 2, 1));
    after = region.getSubregion(patWidth, patHeight, 3 + patWidth, 1);
    return new Pair(pattern, after);
  };

  return PairParser;

})();
});

;require.register("lib/router", function(exports, require, module) {
var Router, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Router = (function(_super) {
  __extends(Router, _super);

  function Router() {
    _ref = Router.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Router.prototype.routes = {
    'pattern/:pattern': 'homeWithPattern',
    'comp/:compressed': 'homeWithComp',
    '': 'home'
  };

  Router.prototype.home = function() {
    return $('body').html(application.homeView.render().el);
  };

  Router.prototype.homeWithPattern = function(pattern) {
    application.world.initWith(pattern);
    return $('body').html(application.homeView.render().el);
  };

  Router.prototype.homeWithComp = function(compressed) {
    application.world.initWithCompressed(compressed);
    return $('body').html(application.homeView.render().el);
  };

  return Router;

})(Backbone.Router);
});

;require.register("lib/target-parser", function(exports, require, module) {
var Region, TargetParser;

Region = require('models/region');

module.exports = TargetParser = (function() {
  var bodyRegexp, header1Regexp, headerRegexp, minHeight, minWidth, tail0Regexp, tail1Regexp;

  function TargetParser() {}

  headerRegexp = /c__+_c/g;

  header1Regexp = /^_cc+c_$/;

  bodyRegexp = /^_c.+c_$/;

  tail0Regexp = header1Regexp;

  tail1Regexp = /^c__+_c$/;

  minHeight = 5;

  minWidth = 5;

  TargetParser.prototype.match = function(region) {
    var m, row, subregion, targetRegion, y, _i, _ref;
    for (y = _i = 0, _ref = region.height - minHeight; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      row = region.getRow(y);
      headerRegexp.lastIndex = 0;
      while ((m = headerRegexp.exec(row))) {
        subregion = region.getSubregion(m[0].length, region.height - y, m.index, y);
        targetRegion = this.submatch(subregion);
        if (targetRegion) {
          return targetRegion;
        }
        headerRegexp.lastIndex = m.index + 1;
      }
    }
    return null;
  };

  TargetParser.prototype.submatch = function(region) {
    var y;
    if (!header1Regexp.exec(region.getRow(1))) {
      return false;
    }
    y = 2;
    while (y < region.height - 1 && bodyRegexp.exec(region.getRow(y))) {
      y = y + 1;
    }
    if (tail0Regexp.exec(region.getRow(y - 1)) && tail1Regexp.exec(region.getRow(y))) {
      return region.getSubregion(region.width - 4, y - 3, 2, 2);
    }
    return null;
  };

  return TargetParser;

})();
});

;require.register("lib/view_helper", function(exports, require, module) {

});

;require.register("models/collection", function(exports, require, module) {
var Collection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref = Collection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Collection;

})(Backbone.Collection);
});

;require.register("models/match-result", function(exports, require, module) {
var MatchResult, Model, assert, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

assert = require('lib/assert');

Model = require('models/model');

module.exports = MatchResult = (function(_super) {
  __extends(MatchResult, _super);

  function MatchResult() {
    _ref = MatchResult.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  MatchResult.prototype.initialize = function(dest, replace) {
    this.dest = dest;
    this.replace = replace;
    assert(this.dest.width === this.replace.width);
    return assert(this.dest.height === this.replace.height);
  };

  MatchResult.prototype.execute = function() {
    return this.dest.replaceWith(this.replace);
  };

  return MatchResult;

})(Model);
});

;require.register("models/model", function(exports, require, module) {
var Model, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Model;

})(Backbone.Model);
});

;require.register("models/pair", function(exports, require, module) {
var MatchResult, Model, Pair, Pattern, Region, assert, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

assert = require('lib/assert');

Model = require('models/model');

Region = require('models/region');

Pattern = require('models/pattern');

MatchResult = require('models/match-result');

module.exports = Pair = (function(_super) {
  __extends(Pair, _super);

  function Pair() {
    _ref = Pair.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Pair.prototype.initialize = function(pattern, after) {
    this.pattern = pattern;
    this.after = after;
    assert(this.pattern instanceof Pattern);
    return assert(this.after instanceof Region);
  };

  Pair.prototype.match = function(region, matchedRegions) {
    var dest, dests, _i, _len, _results;
    dests = this.pattern.match(region, matchedRegions);
    _results = [];
    for (_i = 0, _len = dests.length; _i < _len; _i++) {
      dest = dests[_i];
      _results.push(new MatchResult(dest, this.after));
    }
    return _results;
  };

  return Pair;

})(Model);
});

;require.register("models/pattern", function(exports, require, module) {
var Model, Pattern, assert, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

assert = require('lib/assert');

Model = require('models/model');

module.exports = Pattern = (function(_super) {
  __extends(Pattern, _super);

  function Pattern() {
    _ref = Pattern.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Pattern.prototype.initialize = function(linePatterns) {
    var pat;
    this.regExps = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = linePatterns.length; _i < _len; _i++) {
        pat = linePatterns[_i];
        _results.push(new RegExp("^" + pat));
      }
      return _results;
    })();
    this.topRe = new RegExp(linePatterns[0], "g");
    return this.width = linePatterns[0].length;
  };

  Pattern.fromRegion = function(region) {
    var y;
    return new Pattern((function() {
      var _i, _ref1, _results;
      _results = [];
      for (y = _i = 0, _ref1 = region.height; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; y = 0 <= _ref1 ? ++_i : --_i) {
        _results.push(region.getRow(y));
      }
      return _results;
    })());
  };

  Pattern.prototype.getHeight = function() {
    return this.regExps.length;
  };

  Pattern.prototype.getWidth = function() {
    return this.width;
  };

  Pattern.prototype.match = function(targetRegion, matchedRegions) {
    var m, row, subregion, subregions, y, _i, _ref1,
      _this = this;
    subregions = [];
    if (!matchedRegions) {
      matchedRegions = [];
    }
    for (y = _i = 0, _ref1 = targetRegion.height - this.getHeight(); 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; y = 0 <= _ref1 ? ++_i : --_i) {
      row = targetRegion.getRow(y);
      this.topRe.lastIndex = 0;
      while ((m = this.topRe.exec(row))) {
        subregion = targetRegion.getSubregion(this.getWidth(), this.getHeight(), m.index, y);
        if ((_.every(matchedRegions, function(r) {
          return !r.intersect(subregion);
        })) && this.submatch(subregion)) {
          subregions.push(subregion);
        } else {
          this.topRe.lastIndex = m.index + 1;
        }
      }
    }
    return subregions;
  };

  Pattern.prototype.submatch = function(region) {
    var y, _i, _ref1;
    assert(region.height === this.getHeight());
    for (y = _i = 1, _ref1 = region.height; 1 <= _ref1 ? _i < _ref1 : _i > _ref1; y = 1 <= _ref1 ? ++_i : --_i) {
      if (!this.regExps[y].exec(region.getRow(y))) {
        return false;
      }
    }
    return true;
  };

  return Pattern;

})(Model);
});

;require.register("models/region", function(exports, require, module) {
var Model, Region, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('models/model');

module.exports = Region = (function(_super) {
  __extends(Region, _super);

  function Region() {
    _ref = Region.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Region.prototype.initialize = function(world, _arg) {
    this.world = world;
    this.width = _arg.width, this.height = _arg.height, this.left = _arg.left, this.top = _arg.top;
  };

  Region.prototype.getRow = function(y) {
    return this.world.board[this.top + y].slice(this.left, this.left + this.width);
  };

  Region.prototype.getSubregion = function(width, height, left, top) {
    return new Region(this.world, {
      width: width,
      height: height,
      left: this.left + left,
      top: this.top + top
    });
  };

  Region.prototype.replaceWith = function(region) {
    var end, oRow, row, step, y, _results;
    if (region.width !== this.width || region.height !== this.height) {
      console("replaceWith: not match: " + region.width + "x" + region.height);
      return;
    }
    if (this.top <= region.top) {
      y = 0;
      end = this.height;
      step = 1;
    } else {
      y = this.height - 1;
      end = -1;
      step = -1;
    }
    _results = [];
    while (y !== end) {
      row = this.world.board[this.top + y];
      oRow = region.getRow(y);
      row = row.slice(0, this.left) + oRow + row.slice(this.left + this.width);
      this.world.board[this.top + y] = row;
      _results.push(y = y + step);
    }
    return _results;
  };

  Region.prototype.clone = function() {};

  Region.prototype.right = function() {
    return this.left + this.width;
  };

  Region.prototype.bottom = function() {
    return this.top + this.height;
  };

  Region.prototype.intersect = function(region) {
    var newBottom, newLeft, newRight, newTop;
    if (this.world !== region.world) {
      return null;
    }
    newTop = Math.max(this.top, region.top);
    newLeft = Math.max(this.left, region.left);
    newBottom = Math.min(this.bottom(), region.bottom());
    newRight = Math.min(this.right(), region.right());
    if (newTop < newBottom && newLeft < newRight) {
      return this.world.getRegion(newRight - newLeft, newBottom - newTop, newLeft, newTop);
    } else {
      return null;
    }
  };

  return Region;

})(Model);
});

;require.register("models/world", function(exports, require, module) {
var Model, Region, World, assert, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('models/model');

Region = require('models/region');

assert = require('lib/assert');

module.exports = World = (function(_super) {
  __extends(World, _super);

  function World() {
    _ref = World.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  World.prototype.initialize = function(_arg) {
    var i, row;
    this.width = _arg.width, this.height = _arg.height;
    row = new Array(this.width + 1).join('_');
    return this.board = (function() {
      var _i, _ref1, _results;
      _results = [];
      for (i = _i = 0, _ref1 = this.height; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
        _results.push(row);
      }
      return _results;
    }).call(this);
  };

  World.prototype.initWith = function(pattern) {
    var row, y, _i, _ref1, _results;
    _results = [];
    for (y = _i = 0, _ref1 = this.height; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; y = 0 <= _ref1 ? ++_i : --_i) {
      row = pattern.slice(y * this.width, (y + 1) * this.width);
      row = row + this.board[y].slice(row.length);
      _results.push(this.board[y] = row);
    }
    return _results;
  };

  World.prototype.initWithCompressed = function(data) {
    var base64;
    base64 = data.replace(/\-/g, '+').replace(/\_/g, '/');
    return this.initWith(LZString.decompressFromBase64(base64));
  };

  World.prototype.fixInSanity = function() {
    var emptyRow, row, y, _i, _ref1;
    emptyRow = new Array(this.width + 1).join('_');
    for (y = _i = 0, _ref1 = this.height; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; y = 0 <= _ref1 ? ++_i : --_i) {
      row = this.board[y];
      if (row.length < this.width) {
        this.board[y] += emptyRow.slice(row.length);
      } else if (row.length > this.width) {
        this.board[y] = row.slice(0, this.width);
      }
    }
    return assert(this.checkSanity());
  };

  World.prototype.getData = function() {
    this.fixInSanity();
    return this.board.join('');
  };

  World.prototype.getCompressedData = function() {
    var base64, raw;
    raw = this.getData();
    base64 = LZString.compressToBase64(raw);
    return base64.replace(/\+/g, '-').replace(/\//g, '_');
  };

  World.prototype.getSym = function(x, y) {
    return this.board[y].charAt(x);
  };

  World.prototype.setSym = function(x, y, sym) {
    var row;
    row = this.board[y];
    return this.board[y] = row.slice(0, x) + sym + row.slice(x + 1);
  };

  World.prototype.getRegion = function(width, height, left, top) {
    return new Region(this, {
      width: width,
      height: height,
      left: left,
      top: top
    });
  };

  World.prototype.getWholeRegion = function() {
    return this.getRegion(this.width, this.height, 0, 0);
  };

  World.prototype.checkSanity = function() {
    var _this = this;
    return this.board.length === this.height && _.every(this.board, function(row) {
      return row.length === _this.width;
    });
  };

  return World;

})(Model);
});

;require.register("views/home-view", function(exports, require, module) {
var HomeView, Pair, PalletView, Pattern, View, World, WorldView, template, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

World = require('models/world');

Pattern = require('models/pattern');

Pair = require('models/pair');

View = require('views/view');

WorldView = require('views/world-view');

PalletView = require('views/pallet-view');

template = require('views/templates/home');

module.exports = HomeView = (function(_super) {
  __extends(HomeView, _super);

  function HomeView() {
    this.pickColor = __bind(this.pickColor, this);
    _ref = HomeView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HomeView.prototype.id = 'home-view';

  HomeView.prototype.template = template;

  HomeView.prototype.events = {
    "click #js_play": "play",
    "click #js_pause": "pause",
    "click #js_link": "showLink",
    "click #js_select": "selectMdoe",
    "click #js_paste": "pasteMode"
  };

  HomeView.prototype.initialize = function(_arg) {
    this.world = _arg.world;
    HomeView.__super__.initialize.apply(this, arguments);
    this.worldView = new WorldView({
      model: this.world
    });
    this.palletView = new PalletView;
    this.palletView.setColor('z');
    this.wholeRegion = this.world.getWholeRegion();
    return this.isPlaying = false;
  };

  HomeView.prototype.render = function() {
    HomeView.__super__.render.apply(this, arguments);
    this.$('#js-pallet-container').html(this.palletView.render().el);
    this.$('#js-visulan-slot').html(this.worldView.render().el);
    this.palletView.on('pickColor', this.pickColor);
    this.setIsPlaying(this.isPlaying);
    this.on("playingState", this.setIsPlaying);
    return this;
  };

  HomeView.prototype.setIsPlaying = function(v) {
    this.isPlaying = v;
    this.$('#js_play').prop('disabled', v);
    return this.$('#js_pause').prop('disabled', !v);
  };

  HomeView.prototype.play = function() {
    return this.trigger('play');
  };

  HomeView.prototype.pause = function() {
    return this.trigger('pause');
  };

  HomeView.prototype.showLink = function() {
    var link;
    link = location.protocol + "//";
    link += location.host || "";
    link += location.pathname || "";
    link += '#comp/' + this.world.getCompressedData();
    this.$('#js-link-text').toggle();
    return this.$('#js-link-text').text(link);
  };

  HomeView.prototype.pickColor = function(sym) {
    console.log(sym);
    this.worldView.setPenColor(sym);
    this.worldView.setModeEdit();
    this.$('.js-world-view-mode').removeClass('active');
    return this.palletView.setColor(sym);
  };

  HomeView.prototype.selectMdoe = function() {
    this.worldView.setModeSelect();
    this.$('.js-world-view-mode').removeClass('active');
    this.palletView.setColor(null);
    return this.$('#js_select').addClass('active');
  };

  HomeView.prototype.pasteMode = function() {
    this.worldView.setModePaste();
    this.$('.js-world-view-mode').removeClass('active');
    this.palletView.setColor(null);
    return this.$('#js_paste').addClass('active');
  };

  return HomeView;

})(View);
});

;require.register("views/pallet-view", function(exports, require, module) {
var Color, PalletView, View, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('views/view');

Color = require('lib/color');

module.exports = PalletView = (function(_super) {
  var margin, multi;

  __extends(PalletView, _super);

  function PalletView() {
    _ref = PalletView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PalletView.prototype.id = 'js-pallet-view';

  PalletView.prototype.tagName = 'canvas';

  PalletView.prototype.events = {
    'click': 'choose'
  };

  multi = 12;

  margin = 2;

  PalletView.prototype.render = function() {
    PalletView.__super__.render.apply(this, arguments);
    this.el.height = 1 * multi + 2 * margin;
    this.el.width = multi * Color.symbols.length;
    this.canvasCtx = this.el.getContext('2d');
    this.draw();
    return this;
  };

  PalletView.prototype.draw = function() {
    var x, _i, _ref1, _results;
    if (!this.canvasCtx) {
      return;
    }
    this.canvasCtx.fillStyle = 'black';
    this.canvasCtx.fillRect(0, 0, this.el.width, this.el.height);
    if ((typeof this.colorIx) === "number") {
      this.canvasCtx.fillStyle = 'pink';
      this.canvasCtx.fillRect(this.colorIx * multi, 0, multi, this.el.height);
    }
    _results = [];
    for (x = _i = 0, _ref1 = Color.symbols.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; x = 0 <= _ref1 ? ++_i : --_i) {
      this.canvasCtx.fillStyle = Color.toColor(Color.symbols.charAt(x));
      _results.push(this.canvasCtx.fillRect(x * multi, margin, multi, multi));
    }
    return _results;
  };

  PalletView.prototype.choose = function(event) {
    var x;
    x = (event.offsetX / multi) | 0;
    return this.trigger("pickColor", Color.symbols.charAt(x));
  };

  PalletView.prototype.setColor = function(sym) {
    if (sym) {
      this.colorIx = Color.symbols.indexOf(sym);
    } else {
      this.colorIx = null;
    }
    return this.draw();
  };

  return PalletView;

})(View);
});

;require.register("views/templates/home", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div id=\"content\">\n<div>\n<button id=\"js_play\">Play</button>\n<button id=\"js_pause\">Pause</button>\n<button id=\"js_select\" class='js-world-view-mode'>Select</button>\n<button id=\"js_paste\" class='js-world-view-mode'>Paste</button>\n<span id=\"js-pallet-container\"></span>\n<button id=\"js_link\">Link</button>\n</div>\n<div id=\"js-link-text\" />\n<div id=\"js-visulan-slot\" />\n</div>\n<address>dagezi@gmail.com</address> or <a href=\"http://twitter.com/dagezi/\">@dagezi</a>\n\n";});
});

;require.register("views/view", function(exports, require, module) {
var View, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

require('lib/view_helper');

module.exports = View = (function(_super) {
  __extends(View, _super);

  function View() {
    this.render = __bind(this.render, this);
    _ref = View.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  View.prototype.template = function() {};

  View.prototype.getRenderData = function() {};

  View.prototype.render = function() {
    this.$el.html(this.template(this.getRenderData()));
    this.afterRender();
    return this;
  };

  View.prototype.afterRender = function() {};

  return View;

})(Backbone.View);
});

;require.register("views/world-view", function(exports, require, module) {
var Color, View, WorldView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Color = require('lib/color');

View = require('./view');

module.exports = WorldView = (function(_super) {
  __extends(WorldView, _super);

  function WorldView() {
    _ref = WorldView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  WorldView.prototype.id = 'js-world-view';

  WorldView.prototype.tagName = 'canvas';

  WorldView.prototype.initialize = function(_arg) {
    this.model = _arg.model;
    WorldView.__super__.initialize.apply(this, arguments);
    this.penColor = 'z';
    this.mode = 'edit';
    this.selectionPivot = null;
    return this.selectionOther = null;
  };

  WorldView.prototype.events = {
    "mousedown": "mouseDown",
    "mousemove": "mouseMove",
    "mouseup": "mouseUp"
  };

  WorldView.prototype.render = function() {
    WorldView.__super__.render.apply(this, arguments);
    this.multi = 8;
    this.el.height = this.model.height * this.multi;
    this.el.width = this.model.width * this.multi;
    this.canvasCtx = this.el.getContext('2d');
    this.draw();
    return this;
  };

  WorldView.prototype.draw = function() {
    var region, sym, x, y, _i, _j, _ref1, _ref2;
    for (y = _i = 0, _ref1 = this.model.height; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; y = 0 <= _ref1 ? ++_i : --_i) {
      for (x = _j = 0, _ref2 = this.model.width; 0 <= _ref2 ? _j < _ref2 : _j > _ref2; x = 0 <= _ref2 ? ++_j : --_j) {
        sym = this.model.getSym(x, y);
        this.canvasCtx.fillStyle = Color.toColor(sym);
        this.canvasCtx.fillRect(x * this.multi, y * this.multi, (x + 1) * this.multi, (y + 1) * this.multi);
      }
    }
    if (this.selectionPivot && this.selectionOther) {
      region = this.getRegion(this.selectionPivot, this.selectionOther);
      this.canvasCtx.strokeStyle = 'rgb(200,200,200)';
      return this.canvasCtx.strokeRect(region.left * this.multi, region.top * this.multi, region.width * this.multi - 1, region.height * this.multi - 1);
    }
  };

  WorldView.prototype.getRegion = function(p0, p1) {
    var bottom, height, left, right, top, width;
    left = Math.min(this.selectionPivot[0], this.selectionOther[0]);
    right = Math.max(this.selectionPivot[0], this.selectionOther[0]);
    top = Math.min(this.selectionPivot[1], this.selectionOther[1]);
    bottom = Math.max(this.selectionPivot[1], this.selectionOther[1]);
    width = right - left + 1;
    height = bottom - top + 1;
    return this.model.getRegion(width, height, left, top);
  };

  WorldView.prototype.putPixel = function(x, y, sym) {
    this.model.setSym(x, y, sym);
    return this.draw();
  };

  WorldView.prototype.setPenColor = function(sym) {
    return this.penColor = sym;
  };

  WorldView.prototype.setModeEdit = function() {
    return this.mode = 'edit';
  };

  WorldView.prototype.setModeSelect = function() {
    return this.mode = 'select';
  };

  WorldView.prototype.setModePaste = function() {
    return this.mode = 'paste';
  };

  WorldView.prototype.selectionStart = function(x, y) {
    this.selectionPivot = this.selectionOther = [x, y];
    return this.draw();
  };

  WorldView.prototype.selectionChange = function(x, y) {
    this.selectionOther = [x, y];
    return this.draw();
  };

  WorldView.prototype.paste = function(x, y) {
    var destRegion, sourceRegion;
    sourceRegion = this.getRegion(this.selectionPivot, this.selectionOther);
    destRegion = this.model.getRegion(sourceRegion.width, sourceRegion.height, x, y);
    destRegion.replaceWith(sourceRegion);
    return this.draw();
  };

  WorldView.prototype.getCoordFromMouseEvent = function(e) {
    var x, y;
    if (!e.offsetX === void 0) {
      x = e.offsetX;
    } else {
      x = e.clientX - $(e.target).offset().left;
    }
    y = !e.offsetY === void 0 ? e.offsetY : e.clientY - $(e.target).offset().top;
    return [(x / this.multi) | 0, (y / this.multi) | 0];
  };

  WorldView.prototype.isButtonDown = function(event) {
    if (event.buttons === void 0) {
      return event.which === 1;
    } else {
      return event.buttons === 1;
    }
  };

  WorldView.prototype.mouseDown = function(event) {
    var x, y, _ref1;
    if (!this.isButtonDown(event)) {
      return;
    }
    _ref1 = this.getCoordFromMouseEvent(event), x = _ref1[0], y = _ref1[1];
    switch (this.mode) {
      case 'edit':
        return this.putPixel(x, y, this.penColor);
      case 'select':
        return this.selectionStart(x, y);
      case 'paste':
        return this.paintPivot = [x, y];
    }
  };

  WorldView.prototype.mouseMove = function(event) {
    var x, y, _ref1;
    if (!this.isButtonDown(event)) {
      return;
    }
    _ref1 = this.getCoordFromMouseEvent(event), x = _ref1[0], y = _ref1[1];
    switch (this.mode) {
      case 'edit':
        return this.putPixel(x, y, this.penColor);
      case 'select':
        return this.selectionChange(x, y);
    }
  };

  WorldView.prototype.mouseUp = function(event) {
    var x, y, _ref1;
    _ref1 = this.getCoordFromMouseEvent(event), x = _ref1[0], y = _ref1[1];
    if (this.mode === 'paste' && x === this.paintPivot[0] && y === this.paintPivot[1]) {
      return this.paste(x, y);
    }
  };

  return WorldView;

})(View);
});

;
//@ sourceMappingURL=app.js.map