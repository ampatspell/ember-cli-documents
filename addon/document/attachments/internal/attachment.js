import Base from '../../internal/base';

export default class Attachment extends Base {

  constructor(store, attachments) {
    super(store, attachments);
    this._content = null;
  }

  _createContent(type) {
    return this.store._createInternalAttachmentContent(type, this);
  }

  content(create) {
    let content = this._content;
    if(!content && create) {
      content = this._createContent('placeholder');
      this._content = content;
    }
    return content;
  }

  _createModel() {
    return this.store._createAttachmentModel(this);
  }

  _deserialize() {
  }

}
