import Ember from 'ember';
import Loader from './-loader';
import QueryLoaderState from './-query-loader-state';

const {
  RSVP: { resolve }
} = Ember;

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

  // TODO: _scheduleLoad params
  //
  //         force, reuse, except
  // load:   false, true
  // reload: true,  true
  // auto:   true,  false          (owner property change)
  // auto:   true,  false, [key]   (state query)
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

  //

  load() {
    if(this.state.isLoaded) {
      return resolve();
    }
    return this._scheduleLoad(false, true).promise;
  }

  reload() {
    return this._scheduleLoad(true, true).promise;
  }

}
