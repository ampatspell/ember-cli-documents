import { A } from '@ember/array';
import { assign } from '@ember/polyfills';
import Base from './-base';
import normalizeModelOpts from '../../util/normalize-model-opts';

export default class InternalModelBase extends Base {

  constructor(store, parent, database, factory, opts, _ref) {
    super(store, parent);
    this.database = database;
    this.factory = factory;
    this.opts = opts;
    this._models = null;
    this._ref = _ref;
  }

  models(create) {
    let models = this._models;
    if(!models && create) {
      models = A();
      this._models = models;
    }
    return models;
  }

  _createInternalModel(...args) {
    let opts = assign({ database: this.database, _parent: this }, normalizeModelOpts(...args));
    let internal = this.store._createInternalModel(opts);
    this.models(true).push(internal);
    return internal;
  }

  createModel() {
    return this._createInternalModel(...arguments).model(true);
  }

  _childModelDidDestroy(internal) {
    this.models().removeObject(internal);
  }

  get _modelWillDestroyUnsetsModel() {
    return false;
  }

  _didDestroyModel() {
    let parent = this.parent;
    if(parent) {
      parent._childModelDidDestroy(this);
    }
    let models = this.models(false);
    if(models) {
      models.forEach(model => model.destroy());
    }
  }

  destroy() {
    let model = this.model(false);
    if(model) {
      model.destroy();
    }
  }

}
