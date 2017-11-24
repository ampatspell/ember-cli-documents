import ArrayProxy from '@ember/array/proxy';
import ModelMixin from '../document/-model-mixin';
import TransformMixin from 'documents/util/immutable-array-transform-mixin';
import createArrayUnify from 'documents/util/create-array-unify-mixin';

const UnifyMixin = createArrayUnify({
  root: {
    array: '_internal.stores._stores.all',
    key: 'modelsIdentity.content'
  },
  content: 'content'
});

export default ArrayProxy.extend(ModelMixin, UnifyMixin, TransformMixin, {

  _internal: null,

  modelsByClass(modelClass) {
    return this._internal.modelsByClass(modelClass);
  }

});
