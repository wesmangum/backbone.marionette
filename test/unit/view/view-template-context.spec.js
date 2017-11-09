import Backbone from 'backbone';
import Marionette from '../../../src/backbone.marionette';

describe('template context methods', function() {
  'use strict';
  let templateStub;
  let templateContext;
  let templateContextFn;
  let modelData;
  let model;

  beforeEach(function() {
    templateStub = this.sinon.stub();
    templateContext = {foo: this.sinon.stub()};
    templateContextFn = this.sinon.stub().returns(templateContext);
    modelData = {bar: 'baz'};
    model = new Backbone.Model(modelData);
  });

  describe('view', function() {
    describe('when rendering with no model or collection and a templateContext is found', function() {
      let View;
      let view;

      beforeEach(function() {
        View = Marionette.View.extend({
          templateContext: templateContext,
          template: templateStub
        });

        view = new View();
        view.render();
      });

      it('should include the template context in the data object', function() {
        expect(templateStub).to.have.been.calledOnce.and.calledWith(templateContext);
      });
    });

    describe('when rendering with a model, and a templateContext is found', function() {
      let View;
      let view;

      beforeEach(function() {
        View = Marionette.View.extend({
          templateContext: templateContext,
          template: templateStub
        });

        view = new View({
          model: model
        });

        view.render();
      });

      it('should include the template context in the data object', function() {
        expect(templateStub.lastCall.args[0]).to.contain(templateContext);
      });

      it('should still have the data from the model', function() {
        expect(templateStub.lastCall.args[0]).to.contain(modelData);
      });
    });

    describe('when rendering and a templateContext is found as a function', function() {
      let View;
      let view;

      beforeEach(function() {
        View = Marionette.View.extend({
          templateContext: templateContextFn,
          template: templateStub
        });

        view = new View({
          model: model
        });

        view.render();
      });

      it('should include the template context in the data object', function() {
        expect(templateStub.lastCall.args[0]).to.contain(templateContext);
      });

      it('should still have the data from the model', function() {
        expect(templateStub.lastCall.args[0]).to.contain(modelData);
      });

      it('should maintain the view as the context for the templateContext function', function() {
        expect(templateContextFn).to.have.been.calledOnce.and.calledOn(view);
      });
    });

    describe('when templateContext is provided to constructor options', function() {
      let View;
      let view;

      beforeEach(function() {
        View = Marionette.View.extend({
          template: templateStub
        });

        view = new View({
          templateContext: templateContext,
          model: model
        });

        view.render();
      });

      it('should include the template context in the data object', function() {
        expect(templateStub.lastCall.args[0]).to.contain(templateContext);
      });

      it('should still have the data from the model', function() {
        expect(templateStub.lastCall.args[0]).to.contain(modelData);
      });
    });
  });
});
