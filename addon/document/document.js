import Ember from 'ember';
import DocumentObject from './object';

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

const rev = () => computed('_rev', function() {
  return this._internal.getRev();
}).readOnly();

const serialized = () => computed(function() {
  return this.serialize({ type: 'preview' });
}).readOnly();

const database = () => computed(function() {
  return this._internal.database;
}).readOnly();

export default DocumentObject.extend({

  id: id(),
  rev: rev(),

  database: database(),
  serialized: serialized(),

  serialize(opts) {
    return this._internal.serialize(opts);
  }

});
