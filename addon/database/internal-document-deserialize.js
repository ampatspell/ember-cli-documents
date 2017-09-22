import Ember from 'ember';

const {
  assert
} = Ember;

export default Ember.Mixin.create({

  _deserializeDeleted() {
    let id = doc._id;

    throw new Ember.Error('not implemented');
  },

  _deserializeSaved(doc) {
    let id = doc._id;

    let internal = this._existingInternalDocument(id, { deleted: true, create: true });
    return internal.withPropertyChanges(changed => {
      internal.deserialize(doc, 'document', changed);
      internal.onLoaded(changed);
      return internal;
    }, true);
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
