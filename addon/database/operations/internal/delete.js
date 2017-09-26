import Ember from 'ember';
import Operation from './operation';

const {
  RSVP: { resolve }
} = Ember;

/*

if(internal.state.isNew) {
  return reject(new Error({ error: 'not_saved', reason: 'Model is not saved yet' }));
}

if(internal.state.isDeleted) {
  return reject(new Error({ error: 'deleted', reason: 'Model is already deleted' }));
}

onDeleting

deserializeInternalModelDelete
& remove from identity

error might be not-found deleted.

  _isNotFoundDeleted(err) {
    return err.error === 'not_found' && err.reason === 'deleted';
  },

  _isNotFoundMissing(err) {
    return err.error === 'not_found' && err.reason === 'missing';
  },

  _isNotFoundMissingOrDeleted(err) {
    return this._isNotFoundMissing(err) || this._isNotFoundDeleted(err);
  },


if(this._isNotFoundDeleted(err)) {
  internal.withPropertyChanges(changed => {
    this._deserializeInternalModelDelete(internal, null, changed);
    internal.onError(err, changed);
  });
  return resolve(internal);
}
internal.withPropertyChanges(changed => {
  internal.onError(err, changed);
});
return reject(err);


*/

export default class InternalDocumentBaseLoadOperation extends Operation {
}
