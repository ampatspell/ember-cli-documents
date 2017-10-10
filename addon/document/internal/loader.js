import Base from './base';
import ModelMixin from './-model-mixin';

export default class LoaderInternal extends ModelMixin(Base) {

  /*
    opts: {
      owner: { id: 'id' },
      query(props) {
        return { id: props.id };
      }
    }
  */
  constructor(store, database, owner, opts) {
    super();
    this.store = store;
    this.database = database;
    this.owner = owner;
    this.opts = opts;
  }

  _createModel() {
    return this.store._createLoader(this);
  }

}
