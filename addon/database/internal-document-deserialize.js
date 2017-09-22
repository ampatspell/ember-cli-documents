import Ember from 'ember';

const {
  assert
} = Ember;

export default Ember.Mixin.create({

  _deserializeDeleted(doc) {
    let id = doc._id;

    let internal = this._existingInternalDocument(id, { deleted: true, create: true });

    internal.withPropertyChanges(changed => {
      internal.deserializeDeleted(doc, 'document', changed);
      internal.onDeleted(changed);
    }, true);

    this._storeDeletedInternalDocument(internal);

    return internal;
  },

  _deserializeSaved(doc) {
    let id = doc._id;

    let internal = this._existingInternalDocument(id, { deleted: true, create: true });
    internal.withPropertyChanges(changed => {
      internal.deserialize(doc, 'document', changed);
      internal.onLoaded(changed);
    }, true);

    this._storeLoadedInternalDocument(internal);

    return internal;
  },

  _deserialize(doc) {
    assert(`doc must be object`, typeof doc === 'object');
    assert(`doc._id must be string`, typeof doc._id === 'string');

    if(doc._deleted) {
      return this._deserializeDeleted(doc);
    } else {
      return this._deserializeSaved(doc);
    }
  }

});
