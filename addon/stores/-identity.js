import Ember from 'ember';
import TransformMixin from 'documents/util/document-array-transform-mixin';
import createArrayUnify from 'documents/util/create-array-unify-mixin';

const UnifyMixin = createArrayUnify({
  root: {
    array: '_internal.stores._stores.all',
    key: 'identity.content'
  },
  content: 'content'
});

export default Ember.ArrayProxy.extend(UnifyMixin, TransformMixin, {

  _internal: null

});
