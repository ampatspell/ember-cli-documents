import Ember from 'ember';

const {
  assert
} = Ember;

export default Ember.Mixin.create({

  _deserializeDeletedDocument(internal, doc) {
    internal.withPropertyChanges(changed => {
      internal.deserializeDeleted({ id: doc._id, rev: doc._rev }, changed);
      internal.state.onDeleted(changed);
    }, true);
    this._storeDeletedInternalDocument(internal);
    return internal;
  },

  _deserializeSavedDocument(internal, doc) {
    internal.withPropertyChanges(changed => {
      internal.deserialize(doc, 'document', changed);
      internal.state.onLoaded(changed);
    }, true);
    this._storeLoadedInternalDocument(internal);
    return internal;
  },

  _deserializeDocumentForInternal(internal, doc) {
    if(doc._deleted) {
      return this._deserializeDeletedDocument(internal, doc);
    } else {
      return this._deserializeSavedDocument(internal, doc);
    }
  },

  _deserializeDocument(doc) {
    assert(`doc must be object`, typeof doc === 'object');
    assert(`doc._id must be string`, typeof doc._id === 'string');

    let id = doc._id;
    let internal = this._existingInternalDocument(id, { deleted: true, create: true });

    return this._deserializeDocumentForInternal(internal, doc);
  }

});
