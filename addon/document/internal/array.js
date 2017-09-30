import Ember from 'ember';
import InternalBase, { empty } from './base';
import SerializeMixin from './-serialize-mixin';
import DeserializeMixin from './-deserialize-mixin';
import { toModel, toInternal, isInternal } from 'documents/util/internal';

const {
  A
} = Ember;

export default class InternalArray extends DeserializeMixin(SerializeMixin(InternalBase)) {

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
    super._didCreateModel();
    this.values.addEnumerableObserver(this, this._valueObserverOptions);
  }

  _didDestroyModel() {
    super._didDestroyModel();
    this.values.removeEnumerableObserver(this, this._valueObserverOptions);
  }

  _valueWillChange(array, removing) {
    A(removing).forEach(internal => this._detachInternal(internal));
  }

  _valueDidChange(array, removeCount, adding) {
    A(adding).forEach(internal => this._attachInternal(internal));
    this._didEndPropertyChanges();
    this._dirty();
  }

  toInternal(value, type='model') {
    value = toInternal(value);

    if(isInternal(value)) {
      if(value.isDetached()) {
        return value;
      } else {
        value = value.serialize(type);
      }
    }

    let { internal } = this._deserializeValue(value, empty, type);
    return internal;
  }

  toModel(internal) {
    return toModel(internal);
  }

  _deserialize(values, type) {
    let current = this.values;

    current.forEach(internal => this._detachInternal(internal));
    current.clear();

    let internals = A(values).map(value => {
      let { internal } = this._deserializeValue(value, empty, type);
      return internal;
    });

    current.addObjects(internals);
  }

  _serialize(type) {
    return this.values.map(value => this._serializeValue(value, type));
  }

  _dirty() {
    this.withPropertyChanges(changed => super._dirty(changed), true);
  }

}
