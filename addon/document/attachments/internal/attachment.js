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

  _createContent(value) {
    return this.store._createInternalAttachmentContent(value);
  }

  _replaceModelContent() {
    let model = this.model(false);
    if(!model) {
      return;
    }
    let content = this.content;
    model.set('content', content.model(true));
  }

  _setContent(content) {
    let current = this.content;
    if(current === content) {
      return;
    }
    current.destroy();
    this.content = content;
    this._replaceModelContent();
  }

  _deserialize(value) {
    let content = this.content;
    if(!content.deserialize(value)) {
      content = this._createContent(value);
      this._setContent(content);
    }
  }

  _serialize(type) {
    return this.content.serialize(type);
  }

}
