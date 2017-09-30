import Base from '../../internal/base';

export default class Attachments extends Base {

  constructor(store, document) {
    super(store, document);
  }

  _createModel() {
    return this.store._createAttachmentsModel(this);
  }

  _deserialize() {
  }

}
