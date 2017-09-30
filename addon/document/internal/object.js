import Ember from 'ember';
import InternalBase from './base';
import MutateMixin from './-mutate-mixin';
import DeserializeMixin from './-deserialize-mixin';
import SerializeMixin from './-serialize-mixin';
import EmptyObject from 'documents/util/empty-object';

const {
  String: { underscore, camelize }
} = Ember;

const remove = (array, element) => {
  let idx = array.indexOf(element);
  if(idx === -1) {
    return;
  }
  array.splice(idx, 1);
};

export default class InternalObject extends SerializeMixin(DeserializeMixin(MutateMixin(InternalBase))) {

  static get type() {
    return 'object';
  }

  constructor(store, parent) {
    super(store, parent);
    this.values = new EmptyObject();
  }

  _createModel() {
    return this.store._createObjectModel(this);
  }

  //

  _deserializeKey(key, type) {
    if(type === 'document' && !key.startsWith('_')) {
      return camelize(key);
    }
    return key;
  }

  _deserialize(values, type, changed) {
    let keys = Object.keys(this.values);
    for(let key in values) {
      let deserializedKey = this._deserializeKey(key, type);
      remove(keys, deserializedKey);
      let value = values[key];
      this._setValue(deserializedKey, value, type, changed);
    }
    keys.forEach(key => this._setValue(key, undefined, type, changed));
  }

  _serializeKey(key, type) {
    if(type === 'document' && !key.startsWith('_')) {
      return underscore(key);
    }
    return key;
  }

  _serialize(type) {
    let json = {};
    let values = this.values;
    for(let key in values) {
      let value = values[key];
      value = this._serializeValue(value, type);
      json[this._serializeKey(key, type)] = value;
    }
    return json;
  }

}
