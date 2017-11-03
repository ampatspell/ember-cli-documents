import Base from './-base';
import ModelMixin from './-model-mixin';

export default class InternalModels extends ModelMixin(Base) {

  constructor(store, parent, factory, opts) {
    super(store, parent);
    this.factory = factory;
    this.opts = opts;
  }

  _createModel() {
    return this.store._createModels(this);
  }

}
