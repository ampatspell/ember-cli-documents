import Mixin from '@ember/object/mixin';
import ChangesMixin from '../changes/-mixin';

export default Mixin.create(ChangesMixin, {

  __createInternalChanges(opts) {
    return this._createInternalStoreChanges(opts);
  }

});
