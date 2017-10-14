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

    return database._scheduleDocumentOperation(query, this.type, () => {
      this._withState((state, changed) => state.onLoading(changed));
    }, () => {
      this._withState((state, changed) => state.onLoaded(changed));
    }, err => {
      this._withState((state, changed) => state.onError(err, changed));
    });
  }

  //

  _scheduleLoad(force, reuse, except) {
    this._withState((state, changed) => state.onLoadScheduled(changed), except);

    let operation = this._lastOperation();

    if(!operation || !reuse || (force && this.state.isLoaded && !operation.force)) {
      operation = this._createOperation(() => this._scheduleDocumentOperation(force));
      operation.invoke();
    }

    return operation;
  }

}
