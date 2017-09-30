import Base from '../../internal/base';

const destroyContentModel = content => {
  if(!content) {
    return;
  }
  let model = content.model(false);
  if(!model) {
    return;
  }
  model.destroy();
}

const replaceModelContent = (internal, content) => {
  let model = internal.model(false);
  if(!model) {
    return;
  }
  model.set('content', content.model(true));
}

export default class Attachment extends Base {

  static get type() {
    return 'attachment';
  }

  constructor(store, attachments, content) {
    super(store, attachments);
    content.attachment = this;
    this._content = content;
  }

  _createModel() {
    return this.store._createAttachmentModel(this);
  }

  _createContent(value) {
    return this.store._createInternalAttachmentContent(value);
  }

  get content() {
    return this._content;
  }

  set content(next) {
    let current = this._content;
    if(current === next) {
      return;
    }
    this._content = next;
    replaceModelContent(this, next);
    destroyContentModel(current);
  }

  _deserialize(value) {
    this.content._detach();
    this.content = this._createContent(value);
  }

  _serialize(type) {
    return this.content._serialize(type);
  }

}
