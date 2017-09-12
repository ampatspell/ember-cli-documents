import Ember from 'ember';

const {
  computed,
  computed: { reads },
  copy
} = Ember;

const id = () => {
  return computed('_id', {
    get() {
      return this._internal.getId();
    },
    set(_, value) {
      return this._internal.setId(value);
    }
  });
}

const rev = () => computed('_rev', function() {
  return this._internal.getValue('_rev');
}).readOnly();

const database = () => reads('_internal.database').readOnly();

const serialized = () => computed(function() {
  return this._internal.serialize({ type: 'preview' });
}).readOnly();

export default Ember.Object.extend({

  _internal: null,

  id: id(),
  rev: rev(),

  database: database(),
  serialized: serialized(),

  setUnknownProperty(key, value) {
    return this._internal.setValue(key, value);
  },

  unknownProperty(key) {
    return this._internal.getValue(key);
  }

});
