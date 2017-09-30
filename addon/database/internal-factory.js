import Ember from 'ember';
import DocumentsError from '../util/error';
import { isObject_ } from '../util/assert';

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

  __createInternalAttachmentContent(props) {
    let create = (...args) => this.get('store')._createInternalAttachmentContent(...args);

    if(props.stub === true) {
      return create('stub', props);
    }

    let contentType = props.type || props.contentType || props['content-type'];
    let data = props.data;

    if(typeof data === 'string') {
      contentType = contentType || 'text/plain';
      return create('string', data, contentType);
    }

    if(data instanceof Blob) {
      return create('file', data);
    }

    throw new DocumentsError({
      error: 'invalid_attachment',
      reason: `unsupported attachment object.data '${data}'. data may be String, File or Blob`
    });
  },

  _createInternalAttachment(value) {
    isObject_(`attachment properties must be object { name, type, data } not ${value}`, value);
    let content = this.__createInternalAttachmentContent(value);
    return this.get('store')._createInternalAttachment(null, content);
  }

});
