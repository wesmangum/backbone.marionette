import _ from 'underscore';
import Backbone from 'backbone';
import Marionette from '../../../src/backbone.marionette';

describe('onDomRefresh', function() {
  'use strict';
  let attachedRegion;
  let detachedRegion;
  let BbView;
  let MnView;

  beforeEach(function() {
    this.setFixtures($('<div id="region"></div>'));
    attachedRegion = new Marionette.Region({el: '#region'});
    detachedRegion = new Marionette.Region({el: $('<div></div>')});
    BbView = Backbone.View.extend({
      onDomRefresh: this.sinon.stub()
    });
    _.extend(BbView.prototype, Marionette.BackboneViewMixin);
    MnView = Marionette.View.extend({
      template: _.noop,
      onDomRefresh: this.sinon.stub()
    });
  });

  describe('when a Backbone view is shown detached from the DOM', function() {
    let bbView;

    beforeEach(function() {
      bbView = new BbView();
      detachedRegion.show(bbView);
    });

    it('should never trigger onDomRefresh', function() {
      expect(bbView.onDomRefresh).not.to.have.been.calledOnce;
    });
  });

  describe('when a Marionette view is shown detached from the DOM', function() {
    let mnView;

    beforeEach(function() {
      mnView = new MnView();
      detachedRegion.show(mnView);
    });

    it('should never trigger onDomRefresh', function() {
      expect(mnView.onDomRefresh).not.to.have.been.calledOnce;
    });
  });

  describe('when a Backbone view is shown attached to the DOM', function() {
    let bbView;

    beforeEach(function() {
      bbView = new MnView();
      attachedRegion.show(bbView);
    });

    it('should trigger onDomRefresh on the view', function() {
      expect(bbView.onDomRefresh).to.have.been.calledOnce;
    });
  });

  describe('when a Marionette view is shown attached to the DOM', function() {
    let mnView;

    beforeEach(function() {
      mnView = new MnView();
      attachedRegion.show(mnView);
    });

    it('should trigger onDomRefresh on the view', function() {
      expect(mnView.onDomRefresh).to.have.been.calledOnce;
    });
  });

});
