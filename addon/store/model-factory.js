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
    let content = _internal.content(true).model(true);
    return this._modelFactory('attachment').create({ _internal, content });
  },

  _createObjectModel(_internal) {
    return this._modelFactory('object').create({ _internal });
  },

  _createArrayModel(_internal) {
    let content = _internal.values;
    return this._modelFactory('array').create({ _internal, content });
  }

});
