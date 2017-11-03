import { Model } from 'documents';
import { info } from 'documents/util/logger';

export default Model.extend({

  doc: null,

  // TODO: readOnly attrs check out how would I implement owned blogs

  init() {
    info('init', this+'');
    return this._super(...arguments);
  },

  willDestroy() {
    info('willDestroy', this+'');
    this._super(...arguments);
  }

});
