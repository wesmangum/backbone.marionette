import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from '../../../src/backbone.marionette';

describe('view ui elements', function() {
  'use strict';

  let templateFn;
  let uiHash;
  let model;
  let View;

  beforeEach(function() {
    templateFn = _.template('<div id="<%= name %>"></div>');
    uiHash = {foo: '#foo', bar: '#bar'};
    model = model = new Backbone.Model({name: 'foo'});
    View = Marionette.View.extend({
      template: templateFn,
      ui: uiHash
    });
  });

  describe('when normalizing a ui string', function() {
    let view;

    beforeEach(function() {
      view = new View({model: model});
      view.render();
    });

    it('should return the string unmodified if it does not begin with @ui.', function() {
      expect(view.normalizeUIString('baz')).to.equal('baz');
    })

    it('should translate it if it can be found', function() {
      expect(view.normalizeUIString('@ui.foo')).to.equal('#foo');
    });

    it('should return undefined if it begins with @ui. but can not be found', function() {
      expect(view.normalizeUIString('@ui.baz')).to.equal('undefined');
    });
  });

  describe('when accessing a ui element from the hash', function() {
    let view;

    beforeEach(function() {
      view = new View({model: model});
      view.render();
    });

    it('should return its jQuery selector if it can be found', function() {
      expect(view.ui.foo).to.be.instanceOf(jQuery).and.to.have.lengthOf(1);
    });

    it('should return an empty jQuery object if it cannot be found', function() {
      expect(view.ui.bar).to.be.instanceOf(jQuery).and.to.have.lengthOf(0);
    });

    it('should return its jQuery selector through getUI', function() {
      expect(view.getUI('foo')).to.be.instanceOf(jQuery).and.to.have.lengthOf(1);
      expect(view.getUI('bar')).to.be.instanceOf(jQuery).and.to.have.lengthOf(0);
    });
  });

  describe('when re-rendering a view with a UI element configuration', function() {
    let view;

    beforeEach(function() {
      view = new View({model: model});
      view.render();
      view.model.set('name', 'bar');
      view.render();
    });

    it('should return an up-to-date selector on subsequent renders', function() {
      expect(view.ui.foo).to.be.instanceOf(jQuery).and.to.have.lengthOf(0);
      expect(view.ui.bar).to.be.instanceOf(jQuery).and.to.have.lengthOf(1);
    });

    it('should return an up-to-date selector through getUI', function() {
      expect(view.getUI('foo')).to.be.instanceOf(jQuery).and.to.have.lengthOf(0);
      expect(view.getUI('bar')).to.be.instanceOf(jQuery).and.to.have.lengthOf(1);
    });
  });

  describe('when the ui element is a function that returns a hash', function() {
    let view;

    beforeEach(function() {
      View = View.extend({
        ui: this.sinon.stub().returns(uiHash)
      });

      view = new View({model: model});
      view.render();
    });

    it('should return its jQuery selector if it can be found', function() {
      expect(view.ui.foo).to.be.instanceOf(jQuery).and.to.have.lengthOf(1);
    });

    it('should return an empty jQuery object if it cannot be found', function() {
      expect(view.ui.bar).to.be.instanceOf(jQuery).and.to.have.lengthOf(0);
    });

    it('should return an up-to-date selector on subsequent renders', function() {
      expect(view.ui.foo).to.be.instanceOf(jQuery).and.to.have.lengthOf(1);
      expect(view.ui.bar).to.be.instanceOf(jQuery).to.have.lengthOf(0);

      view.model.set('name', 'bar');
      view.render();

      expect(view.ui.foo).to.have.lengthOf(0);
      expect(view.ui.bar).to.have.lengthOf(1);
    });

    it('should return its jQuery selector through getUI', function() {
      expect(view.getUI('foo')).to.be.instanceOf(jQuery).and.to.have.lengthOf(1);
    });
  });

  describe('when destroying a view that has not been rendered', function() {
    let viewTwo;

    beforeEach(function() {
      this.viewOne = new View({model: model});
      viewTwo = new View({model: model});
    });

    it('should not affect future ui bindings', function() {
      expect(viewTwo.ui).to.deep.equal(uiHash);
    });
  });

  describe('when destroying a view', function() {
    let view;

    beforeEach(function() {
      view = new View({model: model});
      view.render();
      view.destroy();
    });

    it('should unbind UI elements and reset them to the selector', function() {
      expect(view.ui).to.deep.equal(uiHash);
    });
  });

  describe('when calling delegateEvents', function() {
    let view;
    let eventsHash;

    beforeEach(function() {
      uiHash = {'foo': '#foo'};
      eventsHash = {
        'click @ui.foo': 'bar',
        'mouseout @ui#foo': 'baz'
      };

      View = Marionette.View.extend({
        ui: uiHash,
        events: {}
      });

      view = new View();
      view.delegateEvents();

      _.extend(view.events, eventsHash);
      view.delegateEvents();
    });

    it('the events should be re-normalised valid ui references', function() {
      expect(view.events).to.deep.equal({
        'click #foo': 'bar',
        'mouseout @ui#foo': 'baz'
      });
    });
  });
});
