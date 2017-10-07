import Ember from 'ember';
import DocumentsError from 'documents/util/error';
import createTransform from 'documents/util/create-array-transform-mixin';

const {
  computed
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

  content: computed('openDatabases', function() {
    let dbs = this._internal.store.get('openDatabases');
    console.log(dbs);
  }).readOnly()

});
