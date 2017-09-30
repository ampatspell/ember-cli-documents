import Base from '../../internal/base';

export default class Attachment extends Base {

  constructor(store, attachments) {
    super(store, attachments);
  }

  _createModel() {
    return this.store._createAttachmentModel(this);
  }

  _deserialize() {
  }

}
