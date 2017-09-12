import Ember from 'ember';

const {
  getOwner,
  computed,
  copy,
  guidFor,
  Logger: { info }
} = Ember;

const isKeyUnderscored = key => key && key.indexOf('_') === 0;

export default Ember.Object.extend({

  database: null,
  _values: null,
  _model: null,

  model(create=true) {
    let model = this.get('_model');
    if(!model && create) {
      let _internal = this;
      model = getOwner(this).factoryFor('documents:document').create({ _internal });
      this.set('_model', model);
    }
    return model;
  },

  withPropertyChanges(cb, notify) {
    let model;

    if(notify) {
      model = this.model(false);
    }

    if(!model) {
      notify = false;
    }

    if(notify) {
      model.beginPropertyChanges();
    }

    let changes = [];

    let changed = key => {
      info(guidFor(this), 'changed', key);
      if(notify) {
        model.notifyPropertyChange(key);
        if(!changes.includes(key)) {
          changes.push(key);
        }
      }
    }

    let result = cb(changed);

    if(notify && changes.length > 0) {
      model.notifyPropertyChange('serialized');
    }

    if(notify) {
      model.endPropertyChanges();
    }

    return result;
  },

  setId(value) {
    return this._setValue('_id', value, true);
  },

  getId() {
    return this._getValue('_id');
  },

  values() {
    let values = this.get('_values');
    if(!values) {
      values = {};
      values = this.set('_values', values);
    }
    return values;
  },

  _setValue(key, value, notify) {
    let values = this.values();
    let current = values[key];
    if(current === value) {
      return;
    }

    this.withPropertyChanges(changed => {
      values[key] = value;
      changed(key);
    }, notify);

    return value;
  },

  _getValue(key) {
    let values = this.values();
    return values[key];
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
  },

  deserialize(doc, opts) {
    let values = this.values();
    this.withPropertyChanges(changed => {
      for(let key in doc) {
        let value = doc[key];
        if(values[key] !== value) {
          values[key] = value;
          changed(key);
        }
      }
    });
  },

  serialize(opts) {
    return copy(this.values());
  }

});
