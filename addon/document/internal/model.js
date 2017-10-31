import Base from './-base';
import ModelMixin from './-model-mixin';

export default class InternalModel extends ModelMixin(Base) {

  constructor(store, parent, database, factory, opts) {
    super(store, parent);
    this._database = database;
    this.factory = factory;
    this.opts = opts;
  }

  get database() {
    return this._database;
  }

  set database(value) {
    if(this._database === value) {
      return;
    }
    this._database = value;
  }

  _createModel() {
    return this.store._createModel(this);
  }

  get _modelWillDestroyUnsetsModel() {
    return false;
  }

}
