import Ember from 'ember';
import Base from './-model';

const {
  A
} = Ember;

export default class InternalModels extends Base {

  constructor(store, parent, array, factory, opts) {
    super(store, parent, factory, opts);
    this._array = A(array);
    this._values = null;
  }

  _createModel() {
    return this.store._createModels(this);
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

  get _arrayObserverOptions() {
    return {
      willChange: this._arrayWillChange,
      didChange: this._arrayDidChange
    };
  }

  _removeObjects(/*docs*/) {
    // let values = this._values;
    // console.log('removeObjects', A(docs).map(doc => doc));
    // values.removeObjects(docs);
  }

  _addObjects(/*docs*/) {
    // let values = this._values;
    // console.log('addObjects', A(docs).map(doc => doc));
    // values.add(items);
  }

  _arrayWillChange(array, removing) {
    this._removeObjects(removing);
  }

  _arrayDidChange(array, removeCount, adding) {
    this._addObjects(adding);
  }

  _startObserving() {
    let array = this._array;
    array.addEnumerableObserver(this, this._arrayObserverOptions);
    this._addObjects(array);
  }

  _stopObserving() {
    let array = this._array;
    array.removeEnumerableObserver(this, this._arrayObserverOptions);
  }

  _didDestroyModel() {
    this._stopObserving();
    super._didDestroyModel();
  }

}
