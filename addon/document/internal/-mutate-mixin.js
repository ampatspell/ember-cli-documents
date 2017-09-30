import { toModel } from 'documents/util/internal';

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

  _getValueNotify(key, type) {
    return this.withPropertyChanges(changed => this._getValue(key, type, changed), true);
  }

  //

  setValue(key, value) {
    return toModel(this._setValueNotify(key, value, 'model'));
  }

  getValue(key) {
    return toModel(this._getValueNotify(key, 'model'));
  }

}
