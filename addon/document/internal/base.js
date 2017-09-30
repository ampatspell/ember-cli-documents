import Ember from 'ember';
import ModelMixin from './-model-mixin';
import { isInternal } from 'documents/util/internal';

const {
  assert,
  String: { underscore, camelize }
} = Ember;

const types = [ 'document', 'model' ];

export const empty = {};

export default ModelMixin(class InternalBase {

  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
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

  //

  _deserializeKey(key, type) {
    if(type === 'document' && !key.startsWith('_')) {
      return camelize(key);
    }
    return key;
  }

  _serializeKey(key, type) {
    if(type === 'document' && !key.startsWith('_')) {
      return underscore(key);
    }
    return key;
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

});
