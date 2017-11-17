import Ember from 'ember';
import TransformMixin from 'documents/util/immutable-array-transform-mixin';
import createArrayUnify from 'documents/util/create-array-unify-mixin';

const UnifyMixin = createArrayUnify({
  root: {
    array: '_internal.store._databases.all',
    key: '_documents.all'
  },
  content: 'content'
});

export default Ember.ArrayProxy.extend(UnifyMixin, TransformMixin, {

  _internal: null

});
