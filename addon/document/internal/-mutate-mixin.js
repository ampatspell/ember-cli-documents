import { toModel } from 'documents/util/internal';

const arrayRemoveObject = (array, element) => {
  let idx = array.indexOf(element);
  if(idx === -1) {
    return;
  }
  array.splice(idx, 1);
};

export default Class => class MutateMixin extends Class {

  _setValue(key, value, type, changed) {
    let values = this.values;
    let current = values[key];

    let { update, internal } = this._deserializeValue(value, current, type);

    if(update) {
      if(internal === undefined) {
        delete values[key];
      } else {
        values[key] = internal;
      }
      changed(key);
      this._dirty(changed);
    }

    return internal;
  }

  _getValue(key) {
    return this.values[key];
  }

  //

  _setValueNotify(key, value, type) {
    return this.withPropertyChanges(changed => this._setValue(key, value, type, changed), true);
  }

  //

  setValue(key, value) {
    return toModel(this._setValueNotify(key, value, 'model'));
  }

  getValue(key) {
    return toModel(this._getValue(key));
  }

  //

  _deserializeDocumentKey(key) {
    return key;
  }

  _deserializeKey(key, type) {
    if(type === 'document' || type === 'shoebox') {
      return this._deserializeDocumentKey(key);
    }
    return key;
  }

  _serializeDocumentKey(key) {
    return key;
  }

  _serializeKey(key, type) {
    if(type === 'document' || type === 'shoebox') {
      return this._serializeDocumentKey(key);
    }
    return key;
  }

  //

  _deserialize(values, type, changed) {
    let setter = (key, value) => this._setValue(key, value, type, changed);
    let keys = Object.keys(this.values);
    for(let _key in values) {
      let value = values[_key];
      let key = this._deserializeKey(_key, type);
      arrayRemoveObject(keys, key);
      setter(key, value, type);
    }
    keys.forEach(key => setter(key, undefined, type));
  }

  _serialize(type) {
    let json = {};
    let values = this.values;
    for(let _key in values) {
      let value = values[_key];
      let key = this._serializeKey(_key, type);
      value = this._serializeValue(value, type);
      if(value !== undefined) {
        json[key] = value;
      }
    }
    return json;
  }

}
