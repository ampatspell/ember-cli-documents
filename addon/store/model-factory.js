import Ember from 'ember';

export default Ember.Mixin.create({

  _modelFactory(factoryName) {
    return this._factoryFor(`documents:${factoryName}`);
  },

  _createDocumentModel(_internal) {
    return this._modelFactory('document').create({ _internal });
  },

  _createAttachmentsModel(_internal) {
    return this._modelFactory('attachments').create({ _internal });
  },

  _createAttachmentContentModel(type, _internal) {
    return this._modelFactory(`attachment/${type}`).create({ _internal });
  },

  _createAttachmentModel(_internal) {
    let content = _internal.content.model(true);
    return this._modelFactory('attachment').create({ _internal, content });
  },

  _createObjectModel(_internal) {
    return this._modelFactory('object').create({ _internal });
  },

  _createArrayModel(_internal) {
    let content = _internal.values;
    return this._modelFactory('array').create({ _internal, content });
  },

  _changesModelFactory(name) {
    return this._modelFactory(`changes/${name}`);
  },

  _createDatabaseChangesModel(_internal) {
    return this._changesModelFactory('database').create({ _internal });
  },

  _createStoreChangesModel(_internal) {
    return this._changesModelFactory('store').create({ _internal });
  },

  _createDocumentProxy(_internal) {
    return this._modelFactory('proxy/document').create({ _internal });
  },

  _createArrayProxy(_internal) {
    let content = _internal.values;
    return this._modelFactory('proxy/array').create({ _internal, content });
  },

  _createPaginatedProxy(_internal) {
    let content = _internal.values;
    return this._modelFactory('proxy/paginated').create({ _internal, content });
  },

  _createFilter(_internal) {
    return this._modelFactory('filter').create({ _internal });
  },

  _createQueryLoader(_internal) {
    return this._modelFactory('query-loader').create({ _internal });
  }

});
