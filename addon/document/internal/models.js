import { A } from '@ember/array';
import Base from './-model';
import { toModel, toInternal } from '../../util/internal';
import { isArray, isArrayOrArrayProxy, isObject, isFunction_ } from '../../util/assert';

const normalizedModel = model => {
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

const normalizedSource = array => {
  isArrayOrArrayProxy('source array', array);
  return A(array);
};

export default class InternalModels extends Base {

  constructor(stores, parent, array, factory, model, props) {
    super(stores, parent, factory, props);
    this.__source = array;
    this.__child = model;
    this._values = null;
  }

  _prepare(models) {
    // TODO: clean up init ordering
    // this.values should be possible to call w/o this.model(true) before
    let source = this.__source;
    if(!source) {
      source = models.get('source');
    }
    this._source = normalizedSource(source);

    let model = this.__child;
    if(!model) {
      model = models.get('model');
    }
    this._child = normalizedModel(model);
  }

  _createModel() {
    return this.stores._createModels(this);
  }

  _didCreateModel(model) {
    super._didCreateModel(model);
    this._prepare(model);
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
    let child = this._child;

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

    return this._createInternalModel({ type, props, _ref: doc });
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

  get _sourceObserverOptions() {
    return {
      willChange: this._sourceWillChange,
      didChange: this._sourceDidChange
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

  _sourceWillChange(array, removing) {
    this._removeObjects(removing);
  }

  _sourceDidChange(array, removeCount, adding) {
    this._addObjects(adding);
  }

  _startObserving() {
    let source = this._source;
    source.addEnumerableObserver(this, this._sourceObserverOptions);
    this._addObjects(source);
  }

  _stopObserving() {
    let source = this._source;
    if(!source) {
      return;
    }
    this._stopObservingObjects(source);
    source.removeEnumerableObserver(this, this._sourceObserverOptions);
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
    let child = this._child;
    if(!child) {
      return;
    }
    let keys = child.observe;
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
    this.stores._didDestroyInternalModels(this);
  }

}
