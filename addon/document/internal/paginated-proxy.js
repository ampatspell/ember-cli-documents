import Ember from 'ember';
import ProxyInternal from './-proxy';
import PaginatedFilter from './paginated-filter';
import { isFunction } from 'documents/util/assert';

const {
  merge
} = Ember;

export default class PaginatedProxyInternal extends ProxyInternal {

  _normalizeOptions(opts) {
    let normalized = super._normalizeOptions(opts);
    let { loaded } = opts;
    isFunction('loaded', loaded);
    return merge({ loaded }, normalized);
  }

  _createModel() {
    return this.store._createPaginatedProxy(this);
  }

  _createLoader() {
    let { owner, query, loaded } = this.opts;
    return this.database._createInternalPaginatedLoader(this, this.owner, { owner, query, loaded });
  }

  get _loadState() {
    return this.loader(true).loadState;
  }

  _loaderLoadStateDidChange() {
    let filter = this.paginatedFilter(false);
    if(filter) {
      filter.state = this._loadState;
    }
  }

  //

  paginatedFilter(create) {
    let filter = this._paginatedFilter;
    if(!filter && create) {
      let { matches } = this.opts;
      filter = new PaginatedFilter(this.all, { matches }, this._loadState);
      this._paginatedFilter = filter;
    }
    return filter;
  }

  //

  get all() {
    return this.filter(true).values;
  }

  get values() {
    return this.paginatedFilter(true).values;
  }

  //

  _didDestroyModel() {
    super._didDestroyModel();
    let paginatedFilter = this.paginatedFilter();
    if(paginatedFilter) {
      paginatedFilter.destroy();
    }
  }

}
