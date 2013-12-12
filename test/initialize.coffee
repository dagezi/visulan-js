tests = [
  './models/world-test'
  './models/region-test'
  './models/pattern-test'
  './models/pair-test'
  './lib/assert-test'
  './lib/target-parser-test'
  './lib/pair-parser-test'
]

for test in tests
  require test
