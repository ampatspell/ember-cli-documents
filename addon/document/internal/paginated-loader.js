import Loader from './-loader';
import PaginatedLoaderState from './-paginated-loader-state';

export default class PaginatedLoaderInternal extends Loader {

  /*
    opts: {
      autoload: true,
      owner: [ 'id' ],
      query(props) {
        return { id: props.id };
      }
    }
  */
  constructor(store, database, owner, opts) {
    super(store, database, owner, opts);
    this._loadState = {};
  }

  _createLoaderState() {
    return new PaginatedLoaderState();
  }

  _createModel() {
    return this.store._createPaginatedLoader(this);
  }

  //

  get query() {
    let state = this._loadState;
    let query = this.opts.query;
    let owner = this.owner;
    return query.call(owner, owner, state);
  }

  //

  load() {
  }

  loadMore() {
  }

  reload() {
  }

}
