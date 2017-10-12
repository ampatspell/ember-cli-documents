import Ember from 'ember';
import DocumentsError from '../util/error';

export default Ember.Mixin.create({

  _internalFactory(factoryName) {
    return this._factoryFor(`documents:internal/${factoryName}`).class;
  },

  _createInternalDocument(database) {
    let InternalDocument = this._internalFactory('document');
    return new InternalDocument(this, database);
  },

  _createInternalAttachments(internal) {
    let InternalAttachments = this._internalFactory('attachments');
    return new InternalAttachments(this, internal);
  },

  _createInternalAttachmentContent(props) {
    const create = (type, ...args) => {
      let InternalAttachmentContent = this._internalFactory(`attachment/${type}`);
      return new InternalAttachmentContent(this, ...args);
    };

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

  _createInternalAttachment(parent, props) {
    let InternalAttachment = this._internalFactory('attachment');
    let content = this._createInternalAttachmentContent(props);
    return new InternalAttachment(this, parent, content);
  },

  _createInternalObject(parent) {
    let InternalObject = this._internalFactory('object');
    return new InternalObject(this, parent);
  },

  _createInternalArray(parent) {
    let InternalArray = this._internalFactory('array');
    return new InternalArray(this, parent);
  },

  _internalChangesFactory(type) {
    return this._internalFactory(`changes/${type}`);
  },

  _createInternalDatabaseChanges(database, opts) {
    let InternalDatabaseChanges = this._internalChangesFactory('database');
    return new InternalDatabaseChanges(this, database, opts);
  },

  _createInternalStoreChanges(opts) {
    let InternalStoreChanges = this._internalChangesFactory('store');
    return new InternalStoreChanges(this, opts);
  },

  _createInternalDocumentProxy(database, owner, opts) {
    let InternalDocumentProxy = this._internalFactory('proxy/document');
    return new InternalDocumentProxy(this, database, owner, opts);
  },

  _createInternalArrayProxy(database, owner, opts) {
    let InternalArrayProxy = this._internalFactory('proxy/array');
    return new InternalArrayProxy(this, database, owner, opts);
  },

  _createInternalFilter(database, owner, opts) {
    let InternalFilter = this._internalFactory('filter');
    return new InternalFilter(this, database, owner, opts);
  },

  _createInternalLoader(database, owner, opts, type) {
    let InternalLoader = this._internalFactory('loader');
    return new InternalLoader(this, database, owner, opts, type);
  }

});
