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
require.register("test/initialize", function(exports, require, module) {
var test, tests, _i, _len;

tests = ['./models/world-test', './models/region-test', './models/pattern-test', './models/pair-test', './lib/assert-test', './lib/target-parser-test', './lib/pair-parser-test'];

for (_i = 0, _len = tests.length; _i < _len; _i++) {
  test = tests[_i];
  require(test);
}
});

;require.register("test/lib/assert-test", function(exports, require, module) {
var assert;

assert = require('lib/assert');

describe('assert', function() {
  it('should throw error on fail', function() {
    var _this = this;
    return expect(function() {
      return assert(1 === 0);
    }).to.throwException();
  });
  return it('should not throw error on success', function() {
    return assert(1 === 1);
  });
});
});

;require.register("test/lib/pair-parser-test", function(exports, require, module) {
var PairParser, Region, World;

World = require('models/world');

Region = require('models/region');

PairParser = require('lib/pair-parser');

describe('PairParser', function() {
  beforeEach(function() {
    return this.pairParser = new PairParser();
  });
  it('should not find any pair', function() {
    var region, world;
    world = new World({
      width: 10,
      height: 10
    });
    region = world.getWholeRegion();
    return expect(this.pairParser.match(region)).to.have.length(0);
  });
  it('should not find any pair for one line', function() {
    var region, world;
    world = new World({
      width: 10,
      height: 10
    });
    world.initWith('__ccccccc_');
    region = world.getWholeRegion();
    return expect(this.pairParser.match(region)).to.have.length(0);
  });
  it('should find minimum pair', function() {
    var data, pair, pairs, region, world;
    world = new World({
      width: 7,
      height: 3
    });
    data = '_ccccc_/_cdcsc_/_ccccc_';
    data = data.replace(/\//g, '');
    world.initWith(data);
    region = world.getWholeRegion();
    pairs = this.pairParser.match(region);
    expect(pairs).to.have.length(1);
    pair = pairs[0];
    expect(pair.after.width).to.be(1);
    expect(pair.after.height).to.be(1);
    expect(pair.after.top).to.be(1);
    return expect(pair.after.left).to.be(4);
  });
  it('should find pair', function() {
    var data, pair, pairs, region, world;
    world = new World({
      width: 9,
      height: 6
    });
    data = '_ccccccc_/_cadcdsc_/_cadcccc_/_ccccdsc_/_cadcdsc_/_ccccccc_';
    data = data.replace(/\//g, '');
    world.initWith(data);
    region = world.getWholeRegion();
    pairs = this.pairParser.match(region);
    expect(pairs).to.have.length(1);
    pair = pairs[0];
    expect(pair.after.width).to.be(2);
    expect(pair.after.height).to.be(4);
    expect(pair.after.top).to.be(1);
    return expect(pair.after.left).to.be(5);
  });
  it('should find pair even there are margin', function() {
    var data, pair, pairs, region, world;
    world = new World({
      width: 11,
      height: 8
    });
    data = 'xx_ccccccc_/yz_cadcdsc_/_c_cadcccc_/dd_ccccdsc_/km_cadcdsc_/ll_ccccccc_';
    data = data.replace(/\//g, '');
    world.initWith(data);
    region = world.getWholeRegion();
    pairs = this.pairParser.match(region);
    expect(pairs).to.have.length(1);
    pair = pairs[0];
    expect(pair.after.width).to.be(2);
    expect(pair.after.height).to.be(4);
    expect(pair.after.top).to.be(1);
    return expect(pair.after.left).to.be(7);
  });
  return it('should find two pairs', function() {
    var data, pair, pairs, region, world;
    world = new World({
      width: 13,
      height: 4
    });
    data = '_ccccc_ccccc_/_cacbc_cbcdc_/_cacbc_cbcdc_/_ccccc_ccccc_';
    data = data.replace(/\//g, '');
    world.initWith(data);
    region = world.getWholeRegion();
    pairs = this.pairParser.match(region);
    expect(pairs).to.have.length(2);
    pair = pairs[0];
    expect(pair.after.width).to.be(1);
    return expect(pair.after.height).to.be(2);
  });
});
});

;require.register("test/lib/target-parser-test", function(exports, require, module) {
var Region, TargetParser, World;

World = require('models/world');

Region = require('models/region');

TargetParser = require('lib/target-parser');

describe('TargetParser', function() {
  beforeEach(function() {
    return this.targetParser = new TargetParser();
  });
  it('should not find false target', function() {
    var region, world;
    world = new World({
      width: 10,
      height: 10
    });
    region = world.getWholeRegion();
    return expect(this.targetParser.match(region)).to.be(null);
  });
  it('should find target', function() {
    var data, region, targetRegion, world;
    world = new World({
      width: 8,
      height: 6
    });
    data = 'c______c/_cccccc_/_cabdcc_/_cabdcc_/_cccccc_/c______c/';
    data = data.replace(/\//g, '');
    world.initWith(data);
    region = world.getWholeRegion();
    targetRegion = this.targetParser.match(region);
    expect(targetRegion).not.to.be(null);
    expect(targetRegion.width).to.be(4);
    expect(targetRegion.height).to.be(2);
    expect(targetRegion.top).to.be(2);
    return expect(targetRegion.left).to.be(2);
  });
  return it('should find target', function() {
    var data, region, targetRegion, world;
    world = new World({
      width: 10,
      height: 10
    });
    data = 'c__ckdc__c/ac______cz/d_cccccc_k/l_cabdcc_b/p_cabdcc_c/c_cccccc_d/ec______cf/';
    data = data.replace(/\//g, '');
    world.initWith(data);
    region = world.getWholeRegion();
    targetRegion = this.targetParser.match(region);
    expect(targetRegion.width).to.be(4);
    expect(targetRegion.height).to.be(2);
    expect(targetRegion.top).to.be(3);
    return expect(targetRegion.left).to.be(3);
  });
});
});

;require.register("test/models/pair-test", function(exports, require, module) {
var MatchResult, Pair, Pattern, World;

World = require('models/world');

Pattern = require('models/pattern');

Pair = require('models/pair');

MatchResult = require('models/match-result');

describe('Pair', function() {
  beforeEach(function() {
    var afterRegion, afterWorld, pattern;
    pattern = new Pattern(['a ']);
    afterWorld = new World({
      height: 2,
      width: 2
    });
    afterWorld.initWith(' c a');
    afterRegion = afterWorld.getRegion(2, 1, 0, 0);
    return this.pair = new Pair(pattern, afterRegion);
  });
  return describe('#match', function() {
    it('should return enough data to replace', function() {
      var match, matches, region, world, _i, _len;
      world = new World({
        height: 2,
        width: 4
      });
      world.initWith('a a ' + 'a  b');
      region = world.getWholeRegion();
      matches = this.pair.match(region);
      expect(matches).to.have.length(3);
      expect(matches[0]).to.be.a(MatchResult);
      for (_i = 0, _len = matches.length; _i < _len; _i++) {
        match = matches[_i];
        match.execute();
      }
      expect(region.getRow(0)).to.be(' c c');
      return expect(region.getRow(1)).to.be(' c b');
    });
    it('should avoid collision with trivial exsiting matches', function() {
      var matchedRegions, region, world;
      world = new World({
        height: 2,
        width: 4
      });
      world.initWith('a a ' + 'a  b');
      region = world.getWholeRegion();
      matchedRegions = [region];
      return expect(this.pair.match(region, matchedRegions)).to.have.length(0);
    });
    return it('should avoid collision with exsiting matches', function() {
      var match, matchedRegions, matches, region, world, _i, _len;
      world = new World({
        height: 2,
        width: 4
      });
      world.initWith('a a ' + 'a  b');
      region = world.getWholeRegion();
      matchedRegions = [world.getRegion(2, 1, 0, 1), world.getRegion(1, 2, 3, 0)];
      matches = this.pair.match(region, matchedRegions);
      expect(matches).to.have.length(1);
      for (_i = 0, _len = matches.length; _i < _len; _i++) {
        match = matches[_i];
        match.execute();
      }
      expect(region.getRow(0)).to.be(' ca ');
      return expect(region.getRow(1)).to.be('a  b');
    });
  });
});
});

;require.register("test/models/pattern-test", function(exports, require, module) {
var Pattern, World;

World = require('models/world');

Pattern = require('models/pattern');

describe('Pattern', function() {
  beforeEach(function() {
    this.pattern = new Pattern(["aaa", "aaa", "bbb"]);
    return this.simplePattern = new Pattern(["_"]);
  });
  describe('#initialize', function() {
    return it('should generate expected height and width', function() {
      expect(this.pattern.getHeight()).to.be(3);
      return expect(this.pattern.getWidth()).to.be(3);
    });
  });
  return describe('#match', function() {
    it('should match', function() {
      var region, regions, world;
      world = new World({
        height: 3,
        width: 3
      });
      world.initWith("aaaaaabbb");
      region = world.getWholeRegion();
      regions = this.pattern.match(region);
      expect(regions).to.have.length(1);
      expect(regions[0].top).to.be(0);
      expect(regions[0].left).to.be(0);
      expect(regions[0].width).to.be(3);
      return expect(regions[0].height).to.be(3);
    });
    it('should not match', function() {
      var region, regions, world;
      world = new World({
        height: 3,
        width: 3
      });
      world.initWith("aaaaaabbc");
      region = world.getWholeRegion();
      regions = this.pattern.match(region);
      return expect(regions).to.have.length(0);
    });
    it('should match with backtrack', function() {
      var region, regions, world;
      world = new World({
        height: 3,
        width: 4
      });
      world.initWith("aaaa" + "aaaa" + "abbb");
      region = world.getWholeRegion();
      regions = this.pattern.match(region);
      expect(regions).to.have.length(1);
      return expect(regions[0].left).to.be(1);
    });
    it('subregions should not collide each other, but...', function() {
      var pattern, region, regions, world;
      pattern = new Pattern(["aaa", "aaa"]);
      world = new World({
        height: 3,
        width: 3
      });
      world.initWith("aaa" + "aaa" + "aaa");
      region = world.getWholeRegion();
      regions = pattern.match(region);
      return expect(regions).to.have.length(2);
    });
    it('should not match outside of region horizontally', function() {
      var region, world;
      world = new World({
        height: 3,
        width: 4
      });
      world.initWith("aaaa" + "aaaa" + "abbb");
      region = world.getRegion(3, 3, 0, 0);
      return expect(this.pattern.match(region)).to.have.length(0);
    });
    it('should not match outside of region vertically', function() {
      var region, world;
      world = new World({
        height: 4,
        width: 4
      });
      world.initWith("____" + "aaaa" + "aaaa" + "abbb");
      region = world.getRegion(4, 3, 0, 0);
      return expect(this.pattern.match(region)).to.have.length(0);
    });
    it('should not collide with other matches', function() {
      var matchedRegions, region, world;
      world = new World({
        height: 4,
        width: 4
      });
      region = world.getRegion(4, 4, 0, 0);
      matchedRegions = [region];
      return expect(this.simplePattern.match(region, matchedRegions)).to.have.length(0);
    });
    return it('should match avoiding other matches', function() {
      var matchedRegions, matches, region, world;
      world = new World({
        height: 4,
        width: 4
      });
      region = world.getRegion(4, 4, 0, 0);
      matchedRegions = [];
      matchedRegions.push(world.getRegion(3, 4, 0, 0));
      matchedRegions.push(world.getRegion(1, 2, 3, 1));
      matches = this.simplePattern.match(region, matchedRegions);
      expect(matches).to.have.length(2);
      expect(matches[0].width).to.be(1);
      expect(matches[0].left).to.be(3);
      expect(matches[1].width).to.be(1);
      return expect(matches[1].left).to.be(3);
    });
  });
});
});

;require.register("test/models/region-test", function(exports, require, module) {
var Region, World;

World = require('models/world');

Region = require('models/region');

describe('Region', function() {
  beforeEach(function() {
    return this.world = new World({
      width: 5,
      height: 10
    });
  });
  describe('#getWholeRegion', function() {
    return it('should have orignal size', function() {
      var region;
      region = this.world.getWholeRegion();
      expect(region.width).to.be(this.world.width);
      return expect(region.height).to.be(this.world.height);
    });
  });
  describe('#getRow', function() {
    return it('should correct row', function() {
      var region;
      region = this.world.getRegion(5, 5, 0, 0);
      this.world.setSym(1, 1, 'a');
      expect(region.getRow(0)).to.be('_____');
      return expect(region.getRow(1)).to.be('_a___');
    });
  });
  describe('#replaceWith', function() {
    it('should copy', function() {
      var dest, src;
      src = this.world.getRegion(5, 4, 0, 0);
      dest = this.world.getRegion(5, 4, 0, 5);
      this.world.setSym(1, 1, 'a');
      this.world.setSym(2, 4, 'b');
      dest.replaceWith(src);
      expect(this.world.checkSanity()).to.be(true);
      expect(this.world.getSym(1, 6)).to.be('a');
      expect(this.world.getSym(2, 9)).to.be('_');
      return expect(src.getRow(1)).to.be(dest.getRow(1));
    });
    it('should copy correctly to overlapped region above', function() {
      var dest, src;
      src = this.world.getRegion(5, 5, 0, 1);
      dest = this.world.getRegion(5, 5, 0, 0);
      this.world.setSym(4, 0, 'z');
      this.world.setSym(1, 1, 'a');
      this.world.setSym(2, 5, 'b');
      dest.replaceWith(src);
      expect(this.world.checkSanity()).to.be(true);
      expect(this.world.getSym(4, 0)).to.be('_');
      expect(this.world.getSym(1, 0)).to.be('a');
      return expect(this.world.getSym(2, 4)).to.be('b');
    });
    return it('should copy correctly to overlapped region below', function() {
      var dest, src;
      src = this.world.getRegion(5, 5, 0, 0);
      dest = this.world.getRegion(5, 5, 0, 1);
      this.world.setSym(1, 0, 'a');
      this.world.setSym(2, 4, 'b');
      this.world.setSym(3, 5, 'c');
      dest.replaceWith(src);
      expect(this.world.checkSanity()).to.be(true);
      expect(this.world.getSym(1, 1)).to.be('a');
      expect(this.world.getSym(2, 5)).to.be('b');
      expect(this.world.getSym(3, 5)).to.be('_');
      return expect(this.world.getSym(3, 6)).to.be('_');
    });
  });
  return describe('#intersect', function() {
    it('should calculate right intersection', function() {
      var intersection, region0, region1;
      region0 = this.world.getRegion(5, 5, 0, 0);
      region1 = this.world.getRegion(4, 5, 1, 3);
      intersection = region0.intersect(region1);
      expect(intersection.width).to.be(4);
      expect(intersection.height).to.be(2);
      intersection = region1.intersect(region0);
      expect(intersection.width).to.be(4);
      return expect(intersection.height).to.be(2);
    });
    it('should return 1x1 region ', function() {
      var intersection, region0, region1;
      region0 = this.world.getRegion(1, 2, 3, 0);
      region1 = this.world.getRegion(1, 2, 3, 1);
      intersection = region0.intersect(region1);
      expect(intersection.width).to.be(1);
      expect(intersection.height).to.be(1);
      intersection = region1.intersect(region0);
      expect(intersection.width).to.be(1);
      return expect(intersection.height).to.be(1);
    });
    return it('should return null', function() {
      var region0, region1;
      region0 = this.world.getRegion(5, 5, 0, 0);
      region1 = this.world.getRegion(5, 5, 0, 5);
      expect(region0.intersect(region1)).to.be(null);
      return expect(region1.intersect(region0)).to.be(null);
    });
  });
});
});

;require.register("test/models/world-test", function(exports, require, module) {
var Region, World;

World = require('models/world');

Region = require('models/region');

describe('World', function() {
  beforeEach(function() {
    return this.world = new World({
      width: 5,
      height: 10
    });
  });
  describe('just after created', function() {
    return it('has specified height', function() {
      expect(this.world.board.length).to.be(10);
      expect(this.world.board[0].length).to.be(5);
      return expect(this.world.checkSanity()).to.be(true);
    });
  });
  describe('#initWith', function() {
    beforeEach(function() {
      return this.world.initWith('_abcd_zzzz_j');
    });
    return it('has init with given pattern', function() {
      expect(this.world.getSym(0, 0)).to.be('_');
      expect(this.world.getSym(1, 0)).to.be('a');
      expect(this.world.getSym(4, 0)).to.be('d');
      expect(this.world.getSym(1, 1)).to.be('z');
      expect(this.world.getSym(4, 1)).to.be('z');
      expect(this.world.getSym(1, 2)).to.be('j');
      expect(this.world.getSym(2, 2)).to.be('_');
      return expect(this.world.getSym(0, 3)).to.be('_');
    });
  });
  describe('#setSym', function() {
    return it('should change cell', function() {
      this.world.setSym(0, 0, 'z');
      expect(this.world.getSym(0, 0)).to.be('z');
      return expect(this.world.checkSanity()).to.be(true);
    });
  });
  describe('#getWholeRegion', function() {
    return it('should create region with same size', function() {
      var region;
      region = this.world.getWholeRegion();
      expect(region).to.be.a(Region);
      expect(region.height).to.be(this.world.height);
      return expect(region.width).to.be(this.world.width);
    });
  });
  describe('#getData', function() {
    return it('should return the data used for initWith', function() {
      var data;
      data = 'adpbcdefgdafdsaafpkafafdsasdlfdsc';
      data += new Array(50 - data.length + 1).join('_');
      this.world.initWith(data);
      return expect(this.world.getData()).to.be(data);
    });
  });
  return describe('#initWithCompressed and #getCompressedData', function() {
    return it('should return the data used for initWith', function() {
      var compressed, data, newWorld;
      data = 'adpbcdefgdafdsaafpkafafdsasdlfdsc';
      data += new Array(50 - data.length + 1).join('_');
      this.world.initWith(data);
      compressed = this.world.getCompressedData();
      expect(compressed.length).to.be.lessThan(data.length);
      console.log(compressed);
      newWorld = new World({
        width: 5,
        height: 10
      });
      newWorld.initWithCompressed(compressed);
      return expect(newWorld.getData()).to.be(data);
    });
  });
});
});

;
//@ sourceMappingURL=test.js.map