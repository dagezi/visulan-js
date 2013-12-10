assert = require 'lib/assert'

describe 'assert', ->
 it 'should throw error on fail', ->
   expect(=> assert 1 == 0).to.throwException()

 it 'should not throw error on success', ->
   assert 1 == 1

