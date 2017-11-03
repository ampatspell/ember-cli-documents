import { Model } from 'documents';

export default Model.extend({

  doc: null,

  // TODO: readOnly attrs check out how would I implement owned blogs

  init() {
    console.log('init', this+'');
    return this._super(...arguments);
  },

  willDestroy() {
    console.log('willDestroy', this+'');
    this._super(...arguments);
  }

});
