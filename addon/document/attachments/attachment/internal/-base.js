import ModelMixin from '../../../internal/-model-mixin';

export default ModelMixin(class AttachmentContent {

  constructor(store) {
    this.store = store;
    this.attachment = null;
  }

  _createModel() {
    return this.store._createAttachmentContentModel(this.type, this);
  }

  detach() {
    this.attachment = null;
  }

  destroyModel() {
    let model = this.model(false);
    if(!model) {
      return;
    }
    model.destroy();
  }

  destroy() {
    this.detach();
    this.destroyModel();
  }

  deserialize() {
    return false;
  }

});
