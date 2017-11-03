import Base from './-base';
import ModelMixin from './-model-mixin';

export default class InternalModel extends ModelMixin(Base) {

  constructor(store, parent, factory, opts) {
    super(store, parent);
    this.factory = factory;
    this.opts = opts;
  }

  _createModel() {
    return this.store._createModel(this);
  }

  get _modelWillDestroyUnsetsModel() {
    return false;
  }

  destroy() {
    let model = this.model(false);
    if(model) {
      model.destroy();
    }
  }

}
