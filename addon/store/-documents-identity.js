import ArrayProxy from '@ember/array/proxy';
import TransformMixin from 'documents/util/immutable-array-transform-mixin';
import createArrayUnify from 'documents/util/create-array-unify-mixin';

const UnifyMixin = createArrayUnify({
  root: {
    array: '_internal.store._databases.all',
    key: '_documents.all'
  },
  content: 'content'
});

export default ArrayProxy.extend(UnifyMixin, TransformMixin, {

  _internal: null

});
