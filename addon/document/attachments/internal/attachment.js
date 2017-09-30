import Base from '../../internal/base';

export default class Attachment extends Base {

  constructor(store, attachments, content) {
    super(store, attachments);
    content.attachment = this;
    this.content = content;
  }

  _createModel() {
    return this.store._createAttachmentModel(this);
  }

  _deserialize() {
  }

}
