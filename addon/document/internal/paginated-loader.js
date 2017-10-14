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
  }

  _createLoaderState() {
    return new PaginatedLoaderState();
  }

  _createModel() {
    return this.store._createPaginatedLoader(this);
  }

  //

  load() {
  }

  loadMore() {
  }

  reload() {
  }

}
