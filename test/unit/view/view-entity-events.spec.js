import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from '../../../src/backbone.marionette';

describe('view entity events', function() {
  'use strict';

  let model;
  let collection;
  let fooStub;
  let barStub;
  let modelEventsStub;
  let collectionEventsStub;

  beforeEach(function() {
    model = new Backbone.Model();
    collection = new Backbone.Collection();

    fooStub = this.sinon.stub();
    barStub = this.sinon.stub();

    modelEventsStub = this.sinon.stub().returns({'foo': fooStub});
    collectionEventsStub = this.sinon.stub().returns({'bar': barStub});
  });

  describe('when a view has string-based model and collection event configuration', function() {
    let fooOneStub;
    let fooTwoStub;
    let barOneStub;
    let barTwoStub;
    let View;

    beforeEach(function() {
      fooOneStub = this.sinon.stub();
      fooTwoStub = this.sinon.stub();
      barOneStub = this.sinon.stub();
      barTwoStub = this.sinon.stub();

      View = Marionette.View.extend({
        modelEvents: {'foo': 'fooOne fooTwo'},
        collectionEvents: {'bar': 'barOne barTwo'},
        fooOne: fooOneStub,
        fooTwo: fooTwoStub,
        barOne: barOneStub,
        barTwo: barTwoStub
      });

      new View({
        model: model,
        collection: collection
      });
    });

    it('should wire up model events', function() {
      model.trigger('foo');
      expect(fooOneStub).to.have.been.calledOnce;
      expect(fooTwoStub).to.have.been.calledOnce;
    });

    it('should wire up collection events', function() {
      collection.trigger('bar');
      expect(barOneStub).to.have.been.calledOnce;
      expect(barTwoStub).to.have.been.calledOnce;
    });
  });

  describe('when a view has function-based model and collection event configuration', function() {
    beforeEach(function() {
      let View = Marionette.View.extend({
        modelEvents: {'foo': fooStub},
        collectionEvents: {'bar': barStub}
      });

      new View({
        model: model,
        collection: collection
      });
    });

    it('should wire up model events', function() {
      model.trigger('foo');
      expect(fooStub).to.have.been.calledOnce;
    });

    it('should wire up collection events', function() {
      collection.trigger('bar');
      expect(barStub).to.have.been.calledOnce;
    });
  });

  describe('when a view has model event config with a specified handler method that doesnt exist', function() {
    let getBadViewInstance;

    beforeEach(function() {
      let View = Marionette.View.extend({
        modelEvents: {foo: 'doesNotExist'},
        model: model
      });

      getBadViewInstance = function() {
        return new View();
      };
    });

    it('should error when method doesnt exist', function() {
      var errorMessage = 'Method "doesNotExist" was configured as an event handler, but does not exist.';
      expect(getBadViewInstance).to.throw(errorMessage);
    });
  });

  describe('when configuring entity events with a function', function() {
    let View;
    let view;

    beforeEach(function() {
      View = Marionette.View.extend({
        modelEvents: modelEventsStub,
        collectionEvents: collectionEventsStub
      });

      view = new View({
        model: model,
        collection: collection
      });
    });

    it('should trigger the model event', function() {
      view.model.trigger('foo');
      expect(fooStub).to.have.been.calledOnce;
    });

    it('should trigger the collection event', function() {
      view.collection.trigger('bar');
      expect(barStub).to.have.been.calledOnce;
    });
  });

  describe('when undelegating entity events on a view', function() {
    let View;
    let view;

    beforeEach(function() {
      View = Marionette.View.extend({
        modelEvents: {'foo': 'foo'},
        collectionEvents: {'bar': 'bar'},
        foo: fooStub,
        bar: barStub
      });

      view = new View({
        model: model,
        collection: collection
      });

      this.sinon.spy(view, 'undelegateEntityEvents');
      view.undelegateEntityEvents();

      model.trigger('foo');
      collection.trigger('bar');
    });

    it('should undelegate the model events', function() {
      expect(fooStub).not.to.have.been.calledOnce;
    });

    it('should undelegate the collection events', function() {
      expect(barStub).not.to.have.been.calledOnce;
    });

    it('should return the view', function() {
      expect(view.undelegateEntityEvents).to.have.returned(view);
    });
  });

  describe('when undelegating events on a view, delegating them again, and then triggering a model event', function() {
    let View;
    let view;

    beforeEach(function() {
      View = Marionette.View.extend({
        modelEvents: {'foo': 'foo'},
        collectionEvents: {'bar': 'bar'},
        foo: fooStub,
        bar: barStub
      });

      view = new View({
        model: model,
        collection: collection
      });

      view.undelegateEntityEvents();
      this.sinon.spy(view, 'delegateEntityEvents');
      view.delegateEntityEvents();
    });

    it('should fire the model event once', function() {
      model.trigger('foo');
      expect(fooStub).to.have.been.calledOnce;
    });

    it('should fire the collection event once', function() {
      collection.trigger('bar');
      expect(barStub).to.have.been.calledOnce;
    });

    it('should return the view from delegateEntityEvents', function() {
      expect(view.delegateEntityEvents).to.have.returned(view);
    });
  });

  describe('when View bound to modelEvent replaces region with new view', function() {
    let View;

    beforeEach(function() {
      this.Layout = Marionette.View.extend({
        template: _.template('<div id="child"></div>'),
        regions: {child: '#child'},
        modelEvents: {'baz': 'foo'},
        foo: fooStub
      });

      View = Marionette.View.extend({
        template: _.template('bar'),
        modelEvents: {'baz': 'bar'},
        bar: barStub
      });

      this.layoutView = new this.Layout({model: model});
      this.itemViewOne = new View({model: model});
      this.itemViewTwo = new View({model: model});

      this.layoutView.render();
      this.layoutView.getRegion('child').show(this.itemViewOne);
      this.layoutView.getRegion('child').show(this.itemViewTwo);

      model.trigger('baz');
    });

    it('should leave the layoutView\'s modelEvent binded', function() {
      expect(fooStub).to.have.been.calledOnce;
    });

    it('should unbind the previous child view\'s modelEvents', function() {
      expect(barStub).to.have.been.calledOnce;
    });
  });
});
