import Ember from 'ember';
import DocumentsError from 'documents/util/error';
import createTransform from 'documents/util/create-array-transform-mixin';

const TransformMixin = createTransform({
  internal() {
    throw new DocumentsError({ error: 'internal', reason: 'database.identity is immutable' });
  },
  public(internal) {
    return internal.model(true);
  }
});

export default Ember.ArrayProxy.extend(TransformMixin);
