import Base from './-model';

export default class InternalModels extends Base {

  constructor(store, parent, source, factory, opts) {
    super(store, parent, factory, opts);
    this._source = source;
  }

  _createModel() {
    return this.store._createModels(this);
  }

}
