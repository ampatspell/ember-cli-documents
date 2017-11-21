import { A } from '@ember/array';
import Base from './-model';
import { toModel, toInternal } from '../../util/internal';
import { isArray, isArrayOrArrayProxy, isObject, isFunction_ } from '../../util/assert';

const normalizeModel = model => {
  isObject('model', model);
  let { observe, create } = model;
  isArray('model.observe', observe);
  if(typeof create === 'string') {
    let value = create;
    create = () => value;
  } else {
    isFunction_('model.create must be string or function', create);
  }
  return { observe, create };
};

const normalizeOptions = opts => {
  isObject('model', opts);
  let { model, props } = opts;
  if(props) {
    isObject('props', props);
  }
  model = normalizeModel(model);
  return { model, props };
}

export default class InternalModels extends Base {

  constructor(store, parent, array, factory, opts) {
    isArrayOrArrayProxy('source array', array);
    let { props, model } = normalizeOptions(opts);
    super(store, parent, factory, props);
    this._array = A(array);
    this._values = null;
    this.child = model;
  }

  _createModel() {
    return this.store._createModels(this);
  }

  _didCreateModel(model) {
    super._didCreateModel(model);
    model.set('content', this.values);
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
    let child = this.child;

    let definition = child.create(doc, this.model(true));

    if(!definition) {
      return;
    }

    if(typeof definition === 'string') {
      definition = { type: definition };
    }

    let { type, props } = definition;

    if(!type) {
      return;
    }

    if(props) {
      isObject('props in model.create function result', props);
    }

    return this._createInternalModel(type, props, doc);
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

  _findChildInternalModel(doc) {
    let values = this._values;
    return values.find(internal => internal._ref === doc);
  }

  _findChildInternalModels(docs) {
    let models = A();
    docs.forEach(doc => {
      let internal = this._findChildInternalModel(doc);
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
    this._stopObservingObjects(docs);
    values.removeObjects(models);
    models.forEach(model => model.destroy());
  }

  _addObjects(docs) {
    let models = this._createChildInternalModels(docs);
    let values = this._values;
    this._startObservingObjects(docs);
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
    this._stopObservingObjects(array);
    array.removeEnumerableObserver(this, this._arrayObserverOptions);
  }

  //

  _objectValueForKeyDidChange(doc) {
    this._removeObjects([ doc ]);
    this._addObjects([ doc ]);
  }

  _withObjectObserving(docs, cb) {
    if(docs.length === 0) {
      return;
    }
    let keys = this.child.observe;
    if(!keys || keys.length === 0) {
      return;
    }
    keys.forEach(key => docs.forEach(doc => cb(doc, key)));
  }

  _startObservingObjects(docs) {
    this._withObjectObserving(docs, (doc, key) => {
      doc.addObserver(key, this, this._objectValueForKeyDidChange);
    });
  }

  _stopObservingObjects(docs) {
    this._withObjectObserving(docs, (doc, key) => {
      doc.removeObserver(key, this, this._objectValueForKeyDidChange);
    });
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
    this.store._didDestroyInternalModels(this);
  }

}
