import Backbone from 'backbone';
import Marionette from '../../../src/backbone.marionette';

describe('view triggers', function() {
  'use strict';
  let triggersHash;
  let eventsHash;
  let fooHandlerStub;
  let barHandlerStub;
  let fooEvent;
  let barEvent;

  beforeEach(function() {
    triggersHash = {'foo': 'fooHandler'};
    eventsHash = {'bar': 'barHandler'};

    fooHandlerStub = this.sinon.stub();
    barHandlerStub = this.sinon.stub();

    fooEvent = $.Event('foo');
    barEvent = $.Event('bar');
  });

  describe('when DOM events are configured to trigger a view event, and the DOM events are fired', function() {
    let model;
    let collection;
    let View;
    let view;

    beforeEach(function() {
      model = new Backbone.Model();
      collection = new Backbone.Collection();

      View = Marionette.View.extend({triggers: triggersHash});
      view = new View({
        model: model,
        collection: collection
      });

      view.on('fooHandler', fooHandlerStub);
      view.$el.trigger(fooEvent);
    });

    it('should trigger the first view event', function() {
      expect(fooHandlerStub).to.have.been.calledOnce;
    });

    it('should include the view in the event', function() {
      expect(fooHandlerStub.lastCall.args[0]).to.contain(view);
    });

    it('should include the event object in the event', function() {
      expect(fooHandlerStub.lastCall.args[1]).to.be.an.instanceOf($.Event);
    });
  });

  describe('when triggers and standard events are both configured', function() {
    let View;
    let view;

    beforeEach(function() {
      View = Marionette.View.extend({
        triggers: triggersHash,
        events: eventsHash,
        barHandler: barHandlerStub
      });

      view = new View();
      view.on('fooHandler', fooHandlerStub);

      view.$el.trigger(fooEvent);
      view.$el.trigger(barEvent);
    });

    it('should fire the trigger', function() {
      expect(fooHandlerStub).to.have.been.calledOnce;
    });

    it('should fire the standard event', function() {
      expect(barHandlerStub).to.have.been.calledOnce;
    });
  });

  describe('when triggers are configured with a function', function() {
    let View;
    let view;
    let triggersStub;

    beforeEach(function() {
      triggersStub = this.sinon.stub().returns(triggersHash);
      View = Marionette.View.extend({triggers: triggersStub});
      view = new View();
      view.on('fooHandler', fooHandlerStub);

      view.$el.trigger(fooEvent);
    });

    it('should call the function', function() {
      expect(triggersStub).to.have.been.calledOnce.and.calledOn(view);
    });

    it('should trigger the first view event', function() {
      expect(fooHandlerStub).to.have.been.calledOnce;
    });
  });

  describe('triggers should stop propagation and events by default', function() {
    let View;
    let view;

    beforeEach(function() {
      View = Marionette.View.extend({triggers: triggersHash});
      view = new View();
      view.on('fooHandler', fooHandlerStub);

      view.$el.trigger(fooEvent);
    });

    it('should stop propagation by default', function() {
      expect(fooEvent.isPropagationStopped()).to.be.true;
    });

    it('should prevent default by default', function() {
      expect(fooEvent.isDefaultPrevented()).to.be.true;
    });
  });

  describe('when triggers items are manually configured', function() {
    let View;
    let view;

    beforeEach(function() {
      View = Marionette.View.extend({
        triggers: {
          'foo': {
            event: 'fooHandler',
            preventDefault: true,
            stopPropagation: false
          }
        }
      });
      view = new View();
      view.on('fooHandler', fooHandlerStub);

      view.$el.trigger(fooEvent);
    });

    it('should prevent and dont stop the first view event', function() {
      expect(fooEvent.isDefaultPrevented()).to.be.true;
      expect(fooEvent.isPropagationStopped()).to.be.false;
    });
  });

  describe('when triggersPreventDefault flag is set to false', function() {
    beforeEach(function() {
      Marionette.setEnabled('triggersPreventDefault', false);
    });

    afterEach(function() {
      Marionette.setEnabled('triggersPreventDefault', true);
    });

    describe('triggers should not prevent events by default', function() {
      let View;
      let view;

      beforeEach(function() {
        View = Marionette.View.extend({triggers: triggersHash});
        view = new View();
        view.on('fooHandler', fooHandlerStub);

        view.$el.trigger(fooEvent);
      });

      it('should stop propagation by default', function() {
        expect(fooEvent.isPropagationStopped()).to.be.true;
      });

      it('should not prevent default by default', function() {
        expect(fooEvent.isDefaultPrevented()).to.be.false;
      });
    });

    describe('when triggers items are manually configured', function() {
      let View;
      let view;

      beforeEach(function() {
        View = Marionette.View.extend({
          triggers: {
            'foo': {
              event: 'fooHandler',
              preventDefault: true,
              stopPropagation: true
            }
          }
        });
        view = new View();
        view.on('fooHandler', fooHandlerStub);

        view.$el.trigger(fooEvent);
      });

      it('should prevent and stop the first view event', function() {
        expect(fooEvent.isDefaultPrevented()).to.be.true;
        expect(fooEvent.isPropagationStopped()).to.be.true;
      });
    });
  });

  describe('when triggersStopPropagation flag is set to false', function() {
    beforeEach(function() {
      Marionette.setEnabled('triggersStopPropagation', false);
    });

    afterEach(function() {
      Marionette.setEnabled('triggersStopPropagation', true);
    });

    describe('triggers should not stop propagation by default', function() {
      let View;
      let view;

      beforeEach(function() {
        View = Marionette.View.extend({triggers: triggersHash});
        view = new View();
        view.on('fooHandler', fooHandlerStub);

        view.$el.trigger(fooEvent);
      });

      it('should stop propagation by default', function() {
        expect(fooEvent.isPropagationStopped()).to.be.false;
      });

      it('should prevent default by default', function() {
        expect(fooEvent.isDefaultPrevented()).to.be.true;
      });
    });

    describe('when triggers items are manually configured', function() {
      let View;
      let view;

      beforeEach(function() {
        View = Marionette.View.extend({
          triggers: {
            'foo': {
              event: 'fooHandler',
              preventDefault: true,
              stopPropagation: true
            }
          }
        });
        view = new View();
        view.on('fooHandler', fooHandlerStub);

        view.$el.trigger(fooEvent);
      });

      it('should prevent and stop the first view event', function() {
        expect(fooEvent.isDefaultPrevented()).to.be.true;
        expect(fooEvent.isPropagationStopped()).to.be.true;
      });
    });
  });
});
