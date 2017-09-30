import ModelMixin from '../../../internal/-model-mixin';

export default ModelMixin(class AttachmentContent {

  constructor(store) {
    this.store = store;
    this.attachment = null;
  }

  _createModel() {
    return this.store._createAttachmentContentModel(this.type, this);
  }

  _detach() {
    this.attachment = null;
  }

});
