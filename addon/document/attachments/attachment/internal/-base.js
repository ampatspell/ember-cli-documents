import ModelMixin from '../../../internal/-model-mixin';

export default ModelMixin(class AttachmentContent {

  constructor(store) {
    this.store = store;
    this.attachment = null;
  }

  get location() {
    return 'local';
  }

  _createModel() {
    return this.store._createAttachmentContentModel(this.type, this);
  }

  detach() {
    this.attachment = null;
  }

  destroy() {
    this.detach();
    this._destroyModel();
  }

  deserialize() {
    return false;
  }

});
