import Ember from 'ember';

const {
  getOwner,
  computed
} = Ember;

const isKeyUnderscored = key => key && key.indexOf('_') === 0;

export default Ember.Object.extend({

  database: null,
  doc: null,

  document: computed(function() {
    let _internal = this;
    return getOwner(this).factoryFor('documents:document').create({ _internal });
  }),

  withNotifyPropertyChange(key, fn, notify) {
    let document;
    if(notify) {
      document = this.cacheFor('document');
    }
    if(document && notify) {
      document.propertyWillChange(key);
    }
    let result = fn();
    if(document && notify) {
      document.propertyDidChange(key);
    }
    return result;
  },

  setId(value) {
    return this._setValue('_id', value, true);
  },

  getId() {
    return this._getValue('_id');
  },

  _setValue(key, value, notify) {
    let doc = this.get('doc');
    let current = doc[key];
    if(current === value) {
      return;
    }
    this.withNotifyPropertyChange(key, () => {
      doc[key] = value;
    }, notify);
    return value;
  },

  _getValue(key) {
    return this.get('doc')[key];
  },

  setValue(key, value) {
    if(isKeyUnderscored(key)) {
      return;
    }
    return this._setValue(key, value, true);
  },

  getValue(key) {
    if(isKeyUnderscored(key)) {
      return;
    }
    return this._getValue(key);
  }

});
