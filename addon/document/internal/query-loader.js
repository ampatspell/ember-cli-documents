import Loader from './-loader';
import QueryLoaderState from './-query-loader-state';

export default class QueryLoaderInternal extends Loader {

  /*
    opts: {
      autoload: true,
      owner: [ 'id' ],
      query(owner) {
        let id = owner.get('id');
        if(!id) {
          return;
        }
        return { id };
      }
    }
    type: 'first' / 'find'
  */
  constructor(store, parent, database, owner, opts, type) {
    super(store, parent, database, owner, opts, type);
  }

  _createLoaderState() {
    return new QueryLoaderState(this);
  }

  _createModel() {
    return this.store._createQueryLoader(this);
  }

  _createQuery() {
    let query = this.opts.query(this.owner);
    return { query };
  }

}
