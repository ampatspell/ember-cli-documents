import Ember from 'ember';

const {
  assign
} = Ember;

const noop = () => {};

export default Ember.Mixin.create({

  _createInternalDocument(values, state) {
    values = values || {};
    let internal = this.get('store')._createInternalDocument(this);
    internal._deserialize(values, noop);
    internal.setState(state, noop);
    return internal;
  },

  _createNewInternalDocument(values) {
    let internal = this._createInternalDocument(values, { isDirty: false });
    this._storeNewInternalDocument(internal);
    return internal;
  },

  _createExistingInternalModel(id) {
    let values = { _id: id };
    let internal = this._createInternalDocument(values, { isNew: false, isDirty: false });
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

  _createInternalArray(values) {
    let internal = this.get('store')._createInternalArray(null);
    internal._deserialize(values);
    return internal;
  },

  _createInternalObject(values) {
    let internal = this.get('store')._createInternalObject(null);
    internal._deserialize(values, noop);
    return internal;
  }

});
