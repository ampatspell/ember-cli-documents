import Ember from 'ember';

const {
  defineProperty,
  computed,
  computed: { reads }
} = Ember;

const documentsKey = '_internal.documents';
const ownerKey = '_internal.owner';

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

  dep(ownerKey, internal.opts.source);
  dep(`${documentsKey}.@each`, internal.opts.target);

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
