import Ember from 'ember';
import Loader from './-loader';
import PaginatedLoaderState from './-paginated-loader-state';

const {
  A,
  RSVP: { resolve }
} = Ember;

export default class PaginatedLoaderInternal extends Loader {

  /*
    opts: {
      autoload: true,
      owner: [ 'id' ],
      query(owner, state) {
        let id = owner.get('id');
        id(!id) {
          return;
        }
        if(state) {
          let foo = state.foo;
          ..
        }
        return { ddoc, view, start_key, start_docid, end_key };
      },
      loaded(docs) {
        let isMore = true;
        let state = { foo };
        return { isMore, state };
      }
    }
  */
  constructor(store, parent, database, owner, opts) {
    super(store, parent, database, owner, opts);
    this._loadState = null;
  }

  get loadState() {
    return this._loadState;
  }

  _notifyLoadStateChange() {
    this.parent._loaderLoadStateDidChange(this);
  }

  _createLoaderState() {
    return new PaginatedLoaderState(this);
  }

  _createModel() {
    return this.store._createPaginatedLoader(this);
  }

  _createQuery() {
    let { owner, opts, _loadState } = this;
    return opts.query(owner, _loadState);
  }

  //

  loadMore() {
    return this._withRejectNotLoadable(() => this._scheduleLoadMore().promise);
  }

  //

  _scheduleLoadMore() {
    console.log('_scheduleLoadMore');
    // if(!isLoaded) return this._scheduleLoad();
    // immediately isLoading
    // reset to { isError:false }
  }

}

/*

loadMore() {
  if(!this.state.isLoaded) {
    return this.load();
  }

  if(!this.state.isMore) {
    return resolve();
  }

  return this._scheduleLoadMore().promise;
}

_willLoad() {
  this._withState((state, changed) => state.onLoading(changed));
}

_invokeLoaded(array) {
  let docs = A(array.map(internal => internal.model(true)));
  let state = this._loadState || null;
  return this.opts.loaded(state, docs);
}

_didLoad(array) {
  let { state, isMore } = this._invokeLoaded(array);
  this._loadState = state || null;
  this._withState((state, changed) => state.onLoadedPaginated(isMore, changed));
  this._notifyLoadStateChange();
}

_loadDidFail(err) {
  this._withState((state, changed) => state.onError(err, changed));
}

_scheduleDocumentOperation(force) {
  let { database } = this;

  let query = this._query();

  if(force) {
    query.force = true;
  }

  const before = () => this._willLoad();
  const resolve = ({ result }) => this._didLoad(result);
  const reject = err => this._loadDidFail(err);

  return database._scheduleDocumentFindOperation(query, before, resolve, reject);
}

__scheduleLoad(more) {
  this._withState((state, changed) => state.onLoadScheduled(changed));
  let operation = this._createOperation({ more }, () => this._scheduleDocumentOperation(false));
  operation.invoke();
  return operation;
}

_scheduleLoad() {
  let operation = this._lastOperation();

  if(operation) {
    return operation;
  }

  return this.__scheduleLoad(false);
}

_scheduleForceReload() {
  this._loadState = null;
  this._withState((state, changed) => state.onReset(changed));
  this._notifyLoadStateChange();

  let operation = this._createOperation({ force: true }, () => this._scheduleDocumentOperation(true));
  operation.invoke();
  return operation;
}

_scheduleReload() {
  let operation = this._lastOperation();

  if(operation && (operation.opts.force || !this.state.isLoaded)) {
    return operation;
  }

  return this._scheduleForceReload();
}

_scheduleLoadMore() {
  let operation = this._lastOperation();

  if(operation && operation.opts.more) {
    return operation;
  }

  return this.__scheduleLoad(true);
}

_scheduleAutoload(except) {
  if(!this._needsAutoload()) {
    return;
  }
  this._withState((state, changed) => state.onLoadScheduled(changed), except);
  return this._scheduleLoad();
}

*/
