import Ember from 'ember';
import Base from './-model';
import { omit } from '../../util/object';
import { toModel, toInternal } from '../../util/internal';

const {
  A
} = Ember;

const splitOptions = opts => {
  let { type, create } = opts;
  if(typeof type !== 'function') {
    let value = type;
    type = () => value;
  }
  let remaining = omit(opts, [ 'type', 'create' ]);
  return {
    model: {
      type,
      create
    },
    remaining
  };
}

export default class InternalModels extends Base {

  constructor(store, parent, array, factory, opts) {
    let { model, remaining } = splitOptions(opts);
    super(store, parent, factory, remaining);
    this._array = A(array);
    this._values = null;
    this.item = model;
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

  _createChildInternalModel(doc) {
    let item = this.item;
    let type = item.type(doc);
    if(!type) {
      return;
    }
    let opts = item.create(doc, this.model(true));
    if(!opts) {
      return;
    }
    return this.store._createInternalModel(type, this, opts, doc);
  }

  _createChildInternalModels(docs) {
    let models = A();
    docs.forEach(doc => {
      let internal = this._createChildInternalModel(doc);
      if(internal) {
        models.push(internal);
      }
    });
    return models;
  }

  _findChildInternalModels(docs) {
    let values = this._values;
    let models = A();
    docs.forEach(doc => {
      let internal = values.find(internal => internal._rev === doc);
      if(internal) {
        models.push(internal);
      }
    });
    return models;
  }

  get _arrayObserverOptions() {
    return {
      willChange: this._arrayWillChange,
      didChange: this._arrayDidChange
    };
  }

  _removeObjects(docs) {
    let values = this._values;
    let models = this._findChildInternalModels(docs);
    values.removeObjects(models);
  }

  _addObjects(docs) {
    let models = this._createChildInternalModels(docs);
    let values = this._values;
    values.pushObjects(models);
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

  //

  toModel(internal) {
    return toModel(internal);
  }

  toInternal(model) {
    return toInternal(model);
  }

  _didDestroyModel() {
    this._stopObserving();
    super._didDestroyModel();
  }

}
