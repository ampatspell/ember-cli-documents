import ArrayProxy from '@ember/array/proxy';
import ModelMixin from '../document/-model-mixin';
import TransformMixin from '../util/immutable-array-transform-mixin';

export default ArrayProxy.extend(ModelMixin, TransformMixin, {

  _internal: null,

  modelsByClass(modelClass) {
    return this._internal.modelsByClass(modelClass);
  }

});
