import Ember from 'ember';
import DocumentsError from 'documents/util/error';
import createTransform from 'documents/util/create-array-transform-mixin';
import createArrayUnify from 'documents/util/create-array-unify-mixin';

const TransformMixin = createTransform({
  internal() {
    throw new DocumentsError({ error: 'internal', reason: 'database.identity is immutable' });
  },
  public(internal) {
    return internal && internal.model(true);
  }
});

const UnifyMixin = createArrayUnify({
  root: {
    array: '_internal.store._databases.all',
    key: '_documents.all'
  },
  content: 'content'
});

export default Ember.ArrayProxy.extend(UnifyMixin, TransformMixin, {

  _internal: null,

});
