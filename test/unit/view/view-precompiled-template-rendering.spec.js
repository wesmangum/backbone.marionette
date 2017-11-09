import _ from 'underscore';
import Backbone from 'backbone';

describe('pre-compiled template rendering', function() {
  'use strict';

  describe('when rendering views with pre-compiled template functions', function() {
    let template;
    let View;
    let view;

    beforeEach(function() {
      template = 'foobar';
      View = Backbone.Marionette.View.extend({
        template: _.template(template)
      });
      view = new View();
      view.render();
    });

    it('should render the pre-compiled template', function() {
      expect(view.$el).to.contain.$text(template);
    });
  });
});
