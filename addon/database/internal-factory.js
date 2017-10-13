import Ember from 'ember';

const {
  assign
} = Ember;

export default Ember.Mixin.create({

  __createInternalDocument(values, state, type) {
    let internal = this.get('store')._createInternalDocument(this);
    return internal.withPropertyChanges(changed => {
      internal.deserialize(values, type, changed);
      internal.state.set(state, changed);
      return internal;
    }, false);
  },

  _createNewInternalDocument(values, type) {
    let internal = this.__createInternalDocument(values, { isNew: true, isDirty: false }, type);
    this._storeNewInternalDocument(internal);
    return internal;
  },

  __createExistingInternalDocument(id) {
    let values = { _id: id };
    let internal = this.__createInternalDocument(values, { isNew: false, isDirty: false }, 'document');
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
        internal = this.__createExistingInternalDocument(id);
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
  },

  _createInternalAttachment(props) {
    return this.get('store')._createInternalAttachment(null, props);
  },

  _createInternalDocumentProxy(owner, opts) {
    return this.get('store')._createInternalDocumentProxy(this, owner, opts);
  },

  _createInternalArrayProxy(owner, opts) {
    return this.get('store')._createInternalArrayProxy(this, owner, opts);
  },

  _createInternalPaginatedProxy(owner, opts) {
    return this.get('store')._createInternalPaginatedProxy(this, owner, opts);
  },

  _createInternalFilter(owner, opts) {
    return this.get('store')._createInternalFilter(this, owner, opts);
  },

  _createInternalLoader(owner, opts, type) {
    return this.get('store')._createInternalLoader(this, owner, opts, type);
  }

});
