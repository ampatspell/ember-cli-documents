import Ember from 'ember';

const {
  A,
  assert,
  RSVP: { reject }
} = Ember;

export default Ember.Mixin.create({

  _deserializeInternalOnError(internal, err) {
    internal.withPropertyChanges(changed => {
      internal.state.onError(err, changed);
    }, true);
    return reject(err);
  },

  _deserializeInternalSave(internal, json) {
    internal.withPropertyChanges(changed => {
      internal.deserializeSaved(json, changed);
      internal.state.onSaved(changed);
    }, true);
    this._storeSavedInternalDocument(internal);
    return internal;
  },

  _deserializeInternalSaveDidFail(internal, err) {
    return this._deserializeInternalOnError(internal, err);
  },

  //

  _isNotFoundDeleted(err) {
    return err.error === 'not_found' && err.reason === 'deleted';
  },

  _isNotFoundMissing(err) {
    return err.error === 'not_found' && err.reason === 'missing';
  },

  _isNotFoundMissingOrDeleted(err) {
    return this._isNotFoundMissing(err) || this._isNotFoundDeleted(err);
  },

  _deserializeInternalDelete(internal, json) {
    internal.withPropertyChanges(changed => {
      if(json) {
        internal.deserializeDeleted(json, changed);
      }
      internal.state.onDeleted(changed);
    }, true);
    this._storeDeletedInternalDocument(internal);
    return internal;
  },

  _deserializeInternalOnErrorOrDelete(internal, err) {
    if(!this._isNotFoundMissingOrDeleted(err)) {
      return this._deserializeInternalOnError(internal, err);
    }
    this._deserializeInternalDelete(internal, null);
    return reject(err);
  },

  //

  _deserializeInternalDeleteDidFail(internal, err) {
    return this._deserializeInternalOnErrorOrDelete(internal, err);
  },

  //

  __deserializeInternalLoadDeleted(internal, doc) {
    let { _id: id, _rev: rev } = doc;
    return this._deserializeInternalDelete(internal, { id, rev });
  },

  __deserializeInternalLoadDocument(internal, doc) {
    internal.withPropertyChanges(changed => {
      internal.deserialize(doc, 'document', changed);
      internal.state.onLoaded(changed);
    }, true);
    this._storeLoadedInternalDocument(internal);
    return internal;
  },

  _deserializeInternalLoad(internal, doc) {
    if(doc._deleted) {
      return this.__deserializeInternalLoadDeleted(internal, doc);
    } else {
      return this.__deserializeInternalLoadDocument(internal, doc);
    }
  },

  _deserializeInternalLoadDidFail(internal, err) {
    return this._deserializeInternalOnErrorOrDelete(internal, err);
  },

  //

  _deserializeDocument(doc) {
    assert(`doc must be object`, typeof doc === 'object');
    assert(`doc._id must be string`, typeof doc._id === 'string');

    let id = doc._id;
    let internal = this._existingInternalDocument(id, { deleted: true, create: true });

    return this._deserializeInternalLoad(internal, doc);
  },

  _deserializeDocuments(array) {
    return A(array).reduce((result, doc) => {
      // on high load it is possible that view returns row with already deleted document's key, value but w/o doc
      // see: https://issues.apache.org/jira/browse/COUCHDB-1797
      if(doc) {
        result.push(this._deserializeDocument(doc));
      }
      return result;
    }, A());
  }

});
