import Marionette from '../../src/backbone.marionette';

describe('Behavior', function() {
  'use strict';

  describe('when instantiating a behavior with some options', function() {
    let createOptions;
    let behavior;

    beforeEach(function() {
      createOptions = {foo: 'bar'};
      behavior = new Marionette.Behavior(createOptions);
    });

    it('Those options should be merged into instance options', function() {
      expect(behavior.options.foo).to.be.eq(createOptions.foo);
    });
  });

});
