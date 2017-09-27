import Ember from 'ember';
import Operation from './operation';
import DocumentsError from 'documents/util/error';

const {
  RSVP: { resolve }
} = Ember;

export default class InternalDocumentBaseLoadOperation extends Operation {

  willDelete() {
    this.withPropertyChanges(changed => this.state.onDeleting(changed));
    let internal = this.internal;
    let id = internal.getId();
    let rev = internal.getRev();
    return { id, rev };
  }

  delete(id, rev) {
    return this.docs.delete(id, rev);
  }

  didDelete(json) {
    this._deserializeAndStoreDeleted(json);
    this.resolve();
  }

  deleteDidFail(err) {
    if(!this._deserializeAndStoreDeletedIfNecessary(err)) {
      this.withPropertyChanges(changed => {
        this.state.onError(err, changed);
      });
    }
    this.reject(err);
  }

  invoke() {
    if(this.state.isNew) {
      return this.reject(new DocumentsError({ error: 'not_saved', reason: 'Document is not yet saved' }));
    }

    if(this.state.isDeleted) {
      return this.reject(new DocumentsError({ error: 'deleted', reason: 'Document is already deleted' }));
    }

    return resolve()
      .then(() => this.willDelete())
      .then(({ id, rev}) => this.delete(id, rev))
      .then(json => this.didDelete(json), err => this.deleteDidFail(err));
  }

}
