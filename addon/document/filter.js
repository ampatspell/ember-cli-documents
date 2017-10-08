import Ember from 'ember';

const {
  defineProperty,
  computed,
  computed: { reads }
} = Ember;

const values = internal => {
  let deps = [];

  let dep = (prefix, hash) => {
    if(!hash) {
      return;
    }
    let keys = Object.values(hash);
    if(keys.length === 0) {
      return;
    }
    deps.push(`${prefix}.{${keys.join(',')}}`);
  }

  dep('_internal.owner', internal.opts.owner);
  // TODO: get rid of @each. add explicit observers for documents, notify each document change separately and have enumerableObserver for adds and removes
  dep('_internal.documents.@each', internal.opts.document);

  return computed(...deps, function() {
    return this._internal.recompute();
  }).readOnly();
}

export default Ember.Object.extend({

  _internal: null,

  init() {
    this._super(...arguments);
    defineProperty(this, 'values', values(this._internal));
  },

  value: reads('values.firstObject').readOnly(),

});
