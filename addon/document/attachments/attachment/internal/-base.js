import ModelMixin from '../../../internal/-model-mixin';

export default ModelMixin(class AttachmentContent {

  constructor(store, attachment) {
    this.store = store;
    this.attachment = attachment;
  }

  _createModel() {
    return this.store._createAttachmentContentModel(this.type, this);
  }

});
