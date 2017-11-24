import ObjectProxy from '@ember/object/proxy';
import ModelMixin from '../-model-mixin';
import { markModel } from '../../util/internal';

export default markModel(ObjectProxy.extend(ModelMixin, {

  remove() {
    this._internal.remove();
  }

}));
