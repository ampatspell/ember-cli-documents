import Base from '../../internal/base';

export default class Attachment extends Base {

  static get type() {
    return 'attachment';
  }

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

  _serialize(type) {
    return this.content._serialize(type);
  }

}
