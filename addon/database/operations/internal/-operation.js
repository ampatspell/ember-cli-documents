import Operation from '../-operation';

export default class InternalDocumentOperation extends Operation {

  constructor(internal, opts) {
    super();
    this.internal = internal;
    this.opts = opts || {};
  }

  get db() {
    return this.internal.database;
  }

  get docs() {
    return this.db.get('documents');
  }

  withPropertyChanges(cb) {
    return this.internal.withPropertyChanges(cb, true);
  }

  get state() {
    return this.internal.state;
  }

  _isNotFoundDeleted(err) {
    return err.error === 'not_found' && err.reason === 'deleted';
  }

  _isNotFoundMissing(err) {
    return err.error === 'not_found' && err.reason === 'missing';
  }

  _isNotFoundMissingOrDeleted(err) {
    return this._isNotFoundMissing(err) || this._isNotFoundDeleted(err);
  }

  _deserializeAndStoreDeleted(json) {
    this.withPropertyChanges(changed => {
      if(json) {
        this.internal.deserializeDeleted(json, changed);
      }
      this.state.onDeleted(changed);
    });
    this.db._storeDeletedInternalDocument(this.internal);
  }

  _deserializeAndStoreDeletedIfNecessary(err) {
    if(!this._isNotFoundMissingOrDeleted(err)) {
      return false;
    }
    this._deserializeAndStoreDeleted(null);
    return true;
  }

}
