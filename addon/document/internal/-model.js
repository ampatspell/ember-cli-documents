import Ember from 'ember';
import Base from './-base';
import ModelMixin from './-model-mixin';

const {
  A
} = Ember;

export default class InternalModelBase extends ModelMixin(Base) {

  constructor(store, parent, factory, opts) {
    super(store, parent);
    this.factory = factory;
    this.opts = opts;
    this._models = null;
  }

  get database() {
    let model = this.model(false);
    if(!model) {
      return;
    }
    return model.get('database');
  }

  models(create) {
    let models = this._models;
    if(!models && create) {
      models = A();
      this._models = models;
    }
    return models;
  }

  _createInternalModel(name, opts) {
    let target = this.database || this.store;
    let internal = target._createInternalModel(name, this, opts);
    this.models(true).push(internal);
    return internal;
  }

  createModel(name, opts) {
    return this._createInternalModel(name, opts).model(true);
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
