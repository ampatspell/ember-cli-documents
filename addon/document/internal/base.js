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

const types = [ 'document', 'model' ];

export default class InternalBase {

  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
    this._model = null;
  }

  get isDocument() {
    return false;
  }

  _document() {
    let target = this;
    while(target) {
      if(target.isDocument) {
        return target;
      }
      target = target.parent;
    }
  }

  _assertType(type) {
    assert(`type must be one of the following [${types.join(', ')}] not '${type}'`, types.includes(type));
  }

  _assertChanged(changed) {
    assert(`changed must be function not ${changed}`, typeof changed === 'function');
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

  _invokeOnParents(cb) {
    let target = this.parent;
    while(target) {
      cb(target);
      target = target.parent;
    }
  }

  //

  _willEndPropertyChanges(changed) {
    changed('serialized');
  }

  _didEndPropertyChanges() {
    this._invokeOnParents(parent => parent.withPropertyChanges(changed => changed('serialized'), true));
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
    if(this.parent === parent) {
      return;
    }
    assert(`internal is already attached`, !this.parent);
    this.parent = parent;
  }

  //

  _detachInternal(value) {
    if(isInternal(value)) {
      value._detach();
    }
  }

  _attachInternal(value) {
    if(isInternal(value)) {
      value._attach(this);
    }
  }

  _createInternalObject(parent, type) {
    return this.store._createInternalObject(parent, type);
  }

  _createInternalArray(parent, type) {
    return this.store._createInternalArray(parent, type);
  }

  //

  _deserializeObjectValue(value, current, type) {
    let internal;
    let update;
    if(isInternalObject(current)) {
      internal = current;
      internal.withPropertyChanges(changed => internal.deserialize(value, type, changed), true);
      update = false;
    } else {
      this._detachInternal(current);
      internal = this._createInternalObject(this);
      internal.withPropertyChanges(changed => internal.deserialize(value, type, changed), false);
      update = true;
    }
    return { update, internal };
  }

  _deserializeArrayValue(value, current, type) {
    let internal;
    let update;
    if(isInternalArray(current)) {
      internal = current;
      internal.withPropertyChanges(changed => internal.deserialize(value, type, changed), true);
      update = false;
    } else {
      this._detachInternal(current);
      internal = this._createInternalArray(this);
      internal.withPropertyChanges(changed => internal.deserialize(value, type, changed), false);
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

  _deserializeValue(value, current, type) {
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
      value = value.serialize('model');
    }

    let valueType = typeOf(value);

    if(valueType === 'object') {
      return this._deserializeObjectValue(value, current, type);
    } else if(valueType === 'array') {
      return this._deserializeArrayValue(value, current, type);
    }

    return this._deserializePrimitiveValue(value, current, type);
  }

  //

  willDeserialize(values) {
    return values;
  }

  deserialize(values, type, changed) {
    this._assertType(type);
    this._assertChanged(changed);

    values = this.willDeserialize(values, type);
    this._deserialize(values, type, changed);
    return this;
  }

  //

  _serializeValue(value, type) {
    if(isInternal(value)) {
      value = value.withPropertyChanges(changed => value.serialize(type, changed), true);
    }
    return value;
  }

  didSerialize(json) {
    return json;
  }

  serialize(type) {
    this._assertType(type);

    let json = this._serialize(type);
    json = this.didSerialize(json, type);
    return json;
  }

  //

  _dirty(changed) {
    if(this.isDocument) {
      this.state.onDirty(changed);
    } else {
      let document = this._document();
      if(document) {
        document.withPropertyChanges(changed => document.state.onDirty(changed), true);
      }
    }
  }

}
