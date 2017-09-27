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
  }
});

const database = () => computed(function() {
  return this._internal.database;
}).readOnly();

const promise = name => function() {
  let internal = this._internal;
  return internal[name].call(internal, ...arguments).then(() => this);
};

export default DocumentObject.extend(StateMixin, {

  id: id(),
  rev: rev(),

  database: database(),

  save:   promise('scheduleSave'),
  load:   promise('scheduleLoad'),
  reload: promise('scheduleReload'),
  delete: promise('scheduleDelete')

});
