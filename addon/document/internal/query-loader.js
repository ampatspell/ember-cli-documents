import Loader from './-loader';
import QueryLoaderState from './-query-loader-state';

export default class QueryLoaderInternal extends Loader {

  /*
    opts: {
      autoload: true,
      owner: [ 'id' ],
      query(props) {
        return { id: props.id };
      }
    }
    type: 'first' / 'find'
  */
  constructor(store, database, owner, opts, type) {
    super(store, database, owner, opts);
    this.type = type;
  }

  _createLoaderState() {
    return new QueryLoaderState();
  }

  _createModel() {
    return this.store._createQueryLoader(this);
  }

  //

  get query() {
    let query = this.opts.query;
    let owner = this.owner;
    return query.call(owner, owner);
  }

  _scheduleDocumentOperation(force) {
    let { database, query } = this;

    if(force) {
      query.force = true;
    }

    const before  = () => this._withState((state, changed) => state.onLoading(changed));
    const resolve = () => this._withState((state, changed) => state.onLoaded(changed));
    const reject  = err => this._withState((state, changed) => state.onError(err, changed));

    return database._scheduleDocumentOperation(query, this.type, before, resolve, reject);
  }

  //

  _scheduleForceReload() {
    this._withState((state, changed) => state.onReset(changed));
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

  _scheduleLoad() {
    let operation = this._lastOperation();

    if(operation) {
      return operation;
    }

    if(!operation) {
      this._withState((state, changed) => state.onLoadScheduled(changed));
      operation = this._createOperation({}, () => this._scheduleDocumentOperation(false));
      operation.invoke();
    }

    return operation;
  }

  _scheduleAutoload(except) {
    if(!this._needsAutoload()) {
      return;
    }
    this._withState((state, changed) => state.onLoadScheduled(changed), except);
    return this._scheduleLoad();
  }

}
