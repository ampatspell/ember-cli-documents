import Ember from 'ember';
import UnknownProperty from './mixins/unknown-property';
import Serialized from './mixins/serialized';

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
};

const rev = () => computed('_rev', function() {
  return this._internal.getValue('_rev');
}).readOnly();

const database = () => reads('_internal.database').readOnly();

export default Ember.Object.extend(UnknownProperty, Serialized, {

  _internal: null,

  id: id(),
  rev: rev(),

  database: database()

});