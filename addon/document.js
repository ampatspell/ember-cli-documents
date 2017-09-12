import Ember from 'ember';

const {
  computed,
  computed: { reads },
  copy
} = Ember;

const id = () => {
  return computed({
    get() {
      return this._internal.getId();
    },
    set(_, value) {
      return this._internal.setId(value);
    }
  });
}

const rev = () => reads('_rev').readOnly();
const database = () => reads('_internal.database').readOnly();

const serialized = () => computed(function() {
  return copy(this._internal.doc);
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
