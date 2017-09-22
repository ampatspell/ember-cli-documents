import Ember from 'ember';

const {
  assign
} = Ember;

export default Ember.Mixin.create({

  _createInternalDocument(values, state, type) {
    let internal = this.get('store')._createInternalDocument(this);
    return internal.withPropertyChanges(changed => {
      internal.deserialize(values, type, changed);
      internal.setState(state, changed);
      return internal;
    }, false);
  },

  _createNewInternalDocument(values, type) {
    let internal = this._createInternalDocument(values, { isDirty: false }, type);
    this._storeNewInternalDocument(internal);
    return internal;
  },

  _createExistingInternalModel(id) {
    let values = { _id: id };
    let internal = this._createInternalDocument(values, { isNew: false, isDirty: false }, 'document');
    this._storeSavedInternalDocument(internal);
    return internal;
  },

  _existingInternalDocument(id, opts) {
    let { create, deleted } = assign({ create: false, deleted: false }, opts);
    let internal = this._internalDocumentWithId(id, deleted);
    if(!internal && create) {
      if(!deleted) {
        internal = this._internalDocumentWithId(id, true);
      }
      if(!internal) {
        internal = this._createExistingInternalModel(id);
      }
    }
    return internal;
  },

  _createInternalArray(values, type) {
    let internal = this.get('store')._createInternalArray(null);
    internal.withPropertyChanges(changed => internal.deserialize(values, type, changed), false);
    return internal;
  },

  _createInternalObject(values, type) {
    let internal = this.get('store')._createInternalObject(null);
    internal.withPropertyChanges(changed => internal.deserialize(values, type, changed), false);
    return internal;
  }

});
