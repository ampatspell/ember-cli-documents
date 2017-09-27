import Ember from 'ember';

const {
  assert
} = Ember;

export default Ember.Mixin.create({

  __deserializeDeletedDocument(internal, doc) {
    internal.withPropertyChanges(changed => {
      internal.deserializeDeleted({ id: doc._id, rev: doc._rev }, changed);
      internal.state.onDeleted(changed);
    }, true);
    this._storeDeletedInternalDocument(internal);
    return internal;
  },

  _deserializeDeletedDocument(doc) {
    let id = doc._id;
    let internal = this._existingInternalDocument(id, { deleted: true, create: true });
    return this.__deserializeDeletedDocument(internal, doc);
  },

  __deserializeSavedDocument(internal, doc) {
    internal.withPropertyChanges(changed => {
      internal.deserialize(doc, 'document', changed);
      internal.state.onLoaded(changed);
    }, true);
    this._storeLoadedInternalDocument(internal);
    return internal;
  },

  _deserializeSavedDocument(doc) {
    let id = doc._id;
    let internal = this._existingInternalDocument(id, { deleted: true, create: true });
    return this.__deserializeSavedDocument(internal, doc);
  },

  _deserializeDocument(doc) {
    assert(`doc must be object`, typeof doc === 'object');
    assert(`doc._id must be string`, typeof doc._id === 'string');

    if(doc._deleted) {
      return this._deserializeDeletedDocument(doc);
    } else {
      return this._deserializeSavedDocument(doc);
    }
  }

});
