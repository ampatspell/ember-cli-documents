import Ember from 'ember';
import DocumentsError from 'documents/util/error';
import createTransform from 'documents/util/create-array-transform-mixin';

const {
  computed,
  computed: { mapBy, reads },
  on,
  A
} = Ember;

const TransformMixin = createTransform({
  internal() {
    throw new DocumentsError({ error: 'internal', reason: 'database.identity is immutable' });
  },
  public(internal) {
    return internal && internal.model(true);
  }
});

export default Ember.ArrayProxy.extend(TransformMixin, {

  _internal: null,

  // TODO: store/-identity
  // collect
  // destroy model
  // destroy database

  _databases: reads('_internal.store._databases.all'),

  content: computed(function() {
    return A();
  })

});
