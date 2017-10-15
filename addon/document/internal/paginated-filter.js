import Ember from 'ember';

const {
  A
} = Ember;

export default class PaginatedFilter {

  constructor(array, state) {
    this._array = array;
    this._state = state;
    this._values = null;
  }

  get values() {
    let values = this._values;
    if(!values) {
      values = A();
      this._values = values;
      this._startObserving();
    }
    return values;
  }

  set state(value) {
    console.log('PaginatedFilter', 'set state', value);
  }

  _remove(docs) {
    let values = this._values;
    console.log('_remove', A(docs).mapBy('id'));
    values.removeObjects(docs);
  }

  get _arrayObserverOptions() {
    return {
      willChange: this._arrayWillChange,
      didChange: this._arrayDidChange
    };
  }

  _arrayWillChange(array, removing) {
    this._remove(removing);
  }

  _arrayDidChange(array, removeCount, adding) {
    console.log('PaginatedFilter', 'array did change', adding);
  }

  _startObserving() {
    console.log('PaginatedFilter', 'start observing');
    let array = this._array;
    array.addEnumerableObserver(this, this._arrayObserverOptions);
  }

  _stopObserving() {
    console.log('PaginatedFilter', 'stop observing');
    let array = this._array;
    array.removeEnumerableObserver(this, this._arrayObserverOptions);
  }

  destroy() {
    this._stopObserving();
  }

}
