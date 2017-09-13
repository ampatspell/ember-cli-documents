import Ember from 'ember';
import InternalMixin from './internal';
import isInternal from '../is-internal';

const {
  Logger: { info },
  guidFor,
  copy,
  typeOf
} = Ember;

export default Ember.Mixin.create(InternalMixin, {

  _parent: null,
  _values: null,

  _notifyPropertiesChangedWithModel(model) {
    if(model) {
      model.notifyPropertyChange('serialized');
    }
    let parent = this._parent;
    if(parent) {
      parent._notifyPropertiesChanged();
    }
  },

  _notifyPropertiesChanged() {
    let model = this.model(false);
    this._notifyPropertiesChangedWithModel(model);
  },

  withPropertyChanges(cb, notify=true) {
    let model;

    if(notify) {
      model = this.model(false);
    }

    if(model && notify) {
      model.beginPropertyChanges();
    }

    let changes = [];

    let changed = key => {
      info(guidFor(this), 'changed', key);
      if(model && notify) {
        model.notifyPropertyChange(key);
      }
      if(!changes.includes(key)) {
        changes.push(key);
      }
    }

    let result = cb(changed);

    if(notify && changes.length) {
      this._notifyPropertiesChangedWithModel(model);
    }

    if(model && notify) {
      model.endPropertyChanges();
    }

    return result;
  },

  values() {
    let values = this.get('_values');
    if(!values) {
      values = {};
      this.set('_values', values);
    }
    return values;
  },

  __detach() {
    this._parent = null;
  },

  __detachInternal(current) {
    if(!isInternal(current)) {
      return;
    }
    current.__detach();
  },

  __setObjectValue(values, key, current, next, changed) {
    let internal;
    if(isInternal(current) === 'object') {
      internal = current;
      internal.deserialize(next);
    } else {
      this.__detachInternal(current);
      internal = this._createInternalObject();
      internal.deserialize(next);
      values[key] = internal;
      changed(key);
    }
    return internal;
  },

  __setArrayValue(values, key, current, next, changed) {

  },

  __setPrimitiveValue(values, key, current, next, changed) {
    this.__detachInternal(current);
    values[key] = next;
    changed(key);
    return next;
  },

  _setValue(key, value, changed) {
    let values = this.values();
    let current = values[key];

    if(current === value) {
      return;
    }

    let type = typeOf(value);

    if(type === 'object') {
      value = this.__setObjectValue(values, key, current, value, changed);
    } else if(type === 'array') {
      value = this.__setArrayValue(values, key, current, value, changed);
    } else {
      value = this.__setPrimitiveValue(values, key, current, value, changed);
    }

    return value;
  },

  _getValue(key) {
    let values = this.values();
    return values[key];
  },

  _setModelValue(key, value, changed) {
    let result = this._setValue(key, value, changed);
    if(isInternal(result)) {
      return result.model();
    }
    return result;
  },

  _getModelValue(key) {
    let result = this._getValue(key);
    if(isInternal(result)) {
      return result.model();
    }
    return result;
  },

  _getModelValueNotify(key) {
    return this._getModelValue(key);
  },

  _setModelValueNotify(key, value) {
    return this.withPropertyChanges(changed => this._setModelValue(key, value, changed));
  },

  deserialize(doc, opts) {
    this.withPropertyChanges(changed => {
      for(let key in doc) {
        let value = doc[key];
        this._setValue(key, value, changed);
      }
    }, true);
  },

  serialize(opts) {
    let object = {};
    let values = this.values();
    for(let key in values) {
      let value = values[key];
      if(isInternal(value)) {
        value = value.serialize(opts);
      }
      object[key] = value;
    }
    return object;
  }

});
