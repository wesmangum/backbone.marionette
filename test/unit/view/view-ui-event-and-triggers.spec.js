import _ from 'underscore';
import Marionette from '../../../src/backbone.marionette';

describe('view ui event trigger configuration', function() {
  'use strict';

  describe('@ui syntax within events and triggers', function() {
    let fooHandlerStub;
    let barHandlerStub;
    let notBarHandlerStub;
    let fooBarBazHandlerStub;
    let templateFn;
    let uiHash;
    let triggersHash;
    let eventsHash;

    beforeEach(function() {
      fooHandlerStub = this.sinon.stub();
      barHandlerStub = this.sinon.stub();
      notBarHandlerStub = this.sinon.stub();
      fooBarBazHandlerStub = this.sinon.stub();

      templateFn = _.template('<div id="foo"></div><div id="bar"></div><div id="baz"></div>');

      uiHash = {
        foo: '#foo',
        bar: '#bar',
        'some-baz': '#baz'
      };

      triggersHash = {
        'click @ui.foo': 'fooHandler',
        'click @ui.some-baz': 'bazHandler'
      };

      eventsHash = {
        'click @ui.bar': barHandlerStub,
        'click div:not(@ui.bar)': notBarHandlerStub,
        'click @ui.foo, @ui.bar, @ui.some-baz': fooBarBazHandlerStub
      };
    });

    describe('as objects', function() {
      let View;
      let view;
      beforeEach(function() {
        View = Marionette.View.extend({
          template: templateFn,
          ui: uiHash,
          triggers: triggersHash,
          events: eventsHash
        });
        view = new View();
        view.render();

        view.on('fooHandler', fooHandlerStub);
      });

      it('should correctly trigger an event', function() {
        view.ui.foo.trigger('click');
        expect(fooHandlerStub).to.have.been.calledOnce;
        expect(fooBarBazHandlerStub).to.have.been.calledOnce;
      });

      it('should correctly trigger a complex event', function() {
        view.ui.bar.trigger('click');
        expect(barHandlerStub).to.have.been.calledOnce;
        expect(fooBarBazHandlerStub).to.have.been.calledOnce;
      });

      it('should correctly call an event', function() {
        view.ui['some-baz'].trigger('click');
        expect(notBarHandlerStub).to.have.been.calledOnce;
        expect(fooBarBazHandlerStub).to.have.been.calledOnce;
      });
    });

    describe('as functions', function() {
      let View;
      let view;

      beforeEach(function() {
        View = Marionette.View.extend({
          template: templateFn,
          ui: this.sinon.stub().returns(uiHash),
          triggers: this.sinon.stub().returns(triggersHash),
          events: this.sinon.stub().returns(eventsHash)
        });
        view = new View();
        view.render();

        view.on('fooHandler', fooHandlerStub);
      });

      it('should initialize events with context of the view', function() {
        expect(View.prototype.events).to.have.been.calledOn(view);
      });

      it('should initialize triggers with context of the view', function() {
        expect(View.prototype.triggers).to.have.been.calledOn(view);
      });

      it('should correctly trigger an event', function() {
        view.ui.foo.trigger('click');
        expect(fooHandlerStub).to.have.been.calledOnce;
        expect(fooBarBazHandlerStub).to.have.been.calledOnce;
      });

      it('should correctly trigger a complex event', function() {
        view.ui.bar.trigger('click');
        expect(barHandlerStub).to.have.been.calledOnce;
        expect(fooBarBazHandlerStub).to.have.been.calledOnce;
      });

      it('should correctly call an event', function() {
        view.ui['some-baz'].trigger('click');
        expect(notBarHandlerStub).to.have.been.calledOnce;
        expect(fooBarBazHandlerStub).to.have.been.calledOnce;
      });
    });
  });
});
