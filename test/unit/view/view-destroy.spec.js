import Marionette from '../../../src/backbone.marionette';

describe('destroying views', function() {
  'use strict';

  describe('when destroying a Marionette.View multiple times', function() {
    let onDestroyStub;
    let view;

    beforeEach(function() {
      onDestroyStub = this.sinon.spy(function() {
        return this.isRendered();
      });

      view = new Marionette.View();
      view.onDestroy = onDestroyStub;

      view.destroy();
      view.destroy();
    });

    it('should only run the destroying code once', function() {
      expect(onDestroyStub).to.have.been.calledOnce;
    });

    it('should mark the view as destroyed', function() {
      expect(view).to.have.property('_isDestroyed', true);
    });
  });

  describe('when destroying a Marionette.View multiple times', function() {
    let onBeforeDestroyStub;
    let itemView;

    beforeEach(function() {
      onBeforeDestroyStub = this.sinon.stub();

      itemView = new Marionette.View();
      itemView.onBeforeDestroy = onBeforeDestroyStub;

      itemView.destroy();
      itemView.destroy();
    });

    it('should only run the destroying code once', function() {
      expect(onBeforeDestroyStub).to.have.been.calledOnce;
    });

    it('should mark the view as destroyed', function() {
      expect(itemView).to.have.property('_isDestroyed', true);
    });
  });
});
