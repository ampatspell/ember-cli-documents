import Ember from 'ember';
import InternalBase from './base';
import { toModel, toInternal, isInternal } from 'documents/util/internal';

const {
  A
} = Ember;

export default class InternalArray extends InternalBase {

  static get type() {
    return 'array';
  }

  constructor(store, parent) {
    super(store, parent);
    this.values = A();
  }

  _createModel() {
    return this.store._createArrayModel(this);
  }

  get _valueObserverOptions() {
    return {
      willChange: this._valueWillChange,
      didChange: this._valueDidChange
    };
  }

  _didCreateModel() {
    this.values.addEnumerableObserver(this, this._valueObserverOptions);
  }

  _didDestroyModel() {
    this.values.removeEnumerableObserver(this, this._valueObserverOptions);
  }

  _valueWillChange() {
  }

  _valueDidChange() {
    this._didEndPropertyChanges();
  }

  _toInternal(value) {
    value = toInternal(value);
    if(isInternal(value)) {
      value = value.serialize({ type: 'copy' });
    }
    let { internal } = this._deserializeValue(value);
    return internal;
  }

  _toModel(internal) {
    return toModel(internal);
  }

  _deserialize(values) {
    let current = this.values;

    current.forEach(internal => this._detachInternal(internal));
    current.clear();

    let internals = A(values).map(value => {
      let { internal } = this._deserializeValue(value);
      return internal;
    });

    current.addObjects(internals);
  }

  _serialize(opts) {
    return this.values.map(value => this._serializeValue(value, opts));
  }

}
