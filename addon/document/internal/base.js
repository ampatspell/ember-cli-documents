import Ember from 'ember';

import {
  toInternal,
  isInternal,
  isInternalObject,
  isInternalArray
} from 'documents/util/internal';

const {
  assert,
  typeOf
} = Ember;

export default class InternalBase {

  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
    this._model = null;
  }

  isDetached() {
    return !this.parent;
  }

  _didCreateModel() {
  }

  _didDestroyModel() {
  }

  model(create) {
    let model = this._model;
    if(!model && create) {
      model = this._createModel();
      this._didCreateModel(model);
      this._model = model;
    }
    return model;
  }

  _modelWillDestroy() {
    let model = this._model;
    this._model = null;
    this._didDestroyModel(model);
  }

  //

  _willEndPropertyChanges(changed) {
    changed('serialized');
  }

  _didEndNestedPropertyChanges() {
    this.withPropertyChanges(changed => changed('serialized'), true);
  }

  _didEndPropertyChanges() {
    let parent = this.parent;
    if(!parent) {
      return;
    }
    parent._didEndNestedPropertyChanges(this);
  }

  withPropertyChanges(cb, notify) {
    assert(`withPropertyChanges notify argument must be boolean`, typeof notify === 'boolean');

    let model;

    if(notify) {
      model = this.model(false);
    }

    if(model && notify) {
      model.beginPropertyChanges();
    }

    let changes = [];

    let changed = key => {
      if(model && notify) {
        model.notifyPropertyChange(key);
      }
      if(!changes.includes(key)) {
        changes.push(key);
      }
    }

    let result = cb(changed);

    if(notify && changes.length) {
      this._willEndPropertyChanges(changed);
    }

    if(model && notify) {
      model.endPropertyChanges();
    }

    if(notify && changes.length) {
      this._didEndPropertyChanges();
    }

    return result;
  }

  //

  _detach() {
    this.parent = null;
  }

  _attach(parent) {
    this.parent = parent;
  }

  //

  _detachInternal(value) {
    if(isInternal(value)) {
      value._detach();
    }
  }

  _attachInternal(value) {
    value._attach(this);
  }

  _createInternalObject(parent) {
    return this.store._createInternalObject(parent);
  }

  _createInternalArray(parent) {
    return this.store._createInternalArray(parent);
  }

  //

  _deserializeObjectValue(value, current) {
    let internal;
    let update;
    if(isInternalObject(current)) {
      internal = current;
      internal.deserialize(value);
      update = false;
    } else {
      this._detachInternal(current);
      internal = this._createInternalObject(this);
      internal.deserialize(value);
      update = true;
    }
    return { update, internal };
  }

  _deserializeArrayValue(value, current) {
    let internal;
    let update;
    if(isInternalArray(current)) {
      internal = current;
      internal.deserialize(value);
      update = false;
    } else {
      this._detachInternal(current);
      internal = this._createInternalArray(this);
      internal.deserialize(value);
      update = true;
    }
    return { update, internal };
  }

  _deserializeInternalArrayValue(value, current) {
    this._detachInternal(current);
    this._attachInternal(value);
    return { update: true, internal: value };
  }

  _deserializeInternalObjectValue(value, current) {
    this._detachInternal(current);
    this._attachInternal(value);
    return { update: true, internal: value };
  }

  _deserializePrimitiveValue(value, current) {
    this._detachInternal(current);
    return { update: true, internal: value };
  }

  _deserializeValue(value, current) {
    value = toInternal(value);

    if(current === value) {
      return {
        update: false,
        internal: value
      };
    }

    if(isInternal(value)) {
      if(value.isDetached()) {
        if(isInternalObject(value)) {
          return this._deserializeInternalObjectValue(value, current);
        } else if(isInternalArray(value)) {
          return this._deserializeInternalArrayValue(value, current);
        }
      }
    }

    if(isInternal(value)) {
      value = value.serialize({ type: 'copy' });
    }

    let type = typeOf(value);

    if(type === 'object') {
      return this._deserializeObjectValue(value, current);
    } else if(type === 'array') {
      return this._deserializeArrayValue(value, current);
    }

    return this._deserializePrimitiveValue(value, current);
  }

  deserialize(values) {
    this.withPropertyChanges(changed => this._deserialize(values, changed), true);
  }

  //

  _serializeValue(value, opts) {
    if(isInternal(value)) {
      value = value.serialize(opts);
    }
    return value;
  }

  serialize(opts) {
    return this.withPropertyChanges(changed => this._serialize(opts, changed), true);
  }

}
