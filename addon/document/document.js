import Ember from 'ember';
import DocumentObject from './object';
import StateMixin from './state-mixin';

const {
  computed
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

const rev = () => computed('_rev', {
  get() {
    return this._internal.getRev();
  },
  set(_, value) {
    return this._internal.setRev(value);
  }
});

const database = () => computed(function() {
  return this._internal.database;
}).readOnly();

export default DocumentObject.extend(StateMixin, {

  id: id(),
  rev: rev(),

  database: database()

});
