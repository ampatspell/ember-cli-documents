import Ember from 'ember';
import Loader from './-loader';
import PaginatedLoaderState from './-paginated-loader-state';

const {
  RSVP: { resolve }
} = Ember;

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
    this._loadState = null;
  }

  _createLoaderState() {
    return new PaginatedLoaderState();
  }

  _createModel() {
    return this.store._createPaginatedLoader(this);
  }

  //

  _willLoad() {
    this._withState((state, changed) => state.onLoading(changed));
  }

  _didLoad(array) {
    let { state, isMore } = this.opts.didLoad(array);
    this._loadState = state;
    this._withState((state, changed) => state.onLoadedPaginated(isMore, changed));
  }

  _loadDidFail(err) {
    this._withState((state, changed) => state.onError(err, changed));
  }

  _scheduleDocumentOperation(force) {
    let { database, owner, _loadState, opts } = this;

    let query = opts.query.call(owner, owner, _loadState);

    if(force) {
      query.force = true;
    }

    const before = () => this._willLoad();
    const resolve = ({ result }) => this._didLoad(result);
    const reject = err => this._loadDidFail(err);

    return database._scheduleDocumentFindOperation(query, before, resolve, reject);
  }

  _scheduleLoad(force, reuse, except) {
    console.log(`_scheduleLoad force=${force}, reuse=${reuse}, except=${except}`);
    // TODO: force, reuse -- use type arg with 'load', 'reload', 'autoload'

    this._withState((state, changed) => state.onLoadScheduled(changed), except);

    let operation = this._createOperation(() => this._scheduleDocumentOperation(force));
    operation.invoke();
    return operation;
  }

  //

  load() {
    if(this.state.isLoaded) {
      return resolve();
    }
    return this._scheduleLoad(false, true).promise;
  }

  loadMore() {
    if(!this.state.isLoaded) {
      return this.load();
    }

    if(!this.state.isMore) {
      return resolve();
    }

    return this._scheduleLoad(false, true).promise;
  }

  // reload() {
  // }

}
