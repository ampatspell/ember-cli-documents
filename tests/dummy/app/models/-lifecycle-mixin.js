import Mixin from '@ember/object/mixin';
import { info } from 'documents/util/logger';

export default Mixin.create({

  init() {
    info('[init]', this+'');
    return this._super(...arguments);
  },

  willDestroy() {
    info('[destroy]', this+'');
    return this._super(...arguments);
  }

});
