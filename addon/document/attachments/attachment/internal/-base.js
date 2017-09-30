import ModelMixin from '../../../internal/-model-mixin';

export default ModelMixin(class AttachmentContent {

  constructor(store) {
    this.store = store;
  }

  attach(attachment) {
    this.attachment = attachment;
    return this;
  }

  _createModel() {
    return this.store._createAttachmentContentModel(this.type, this);
  }

});
