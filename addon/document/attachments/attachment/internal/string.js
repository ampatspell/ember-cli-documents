import LocalContent from './-local';

export default class StringContent extends LocalContent {

  constructor(store, value, contentType) {
    super(store);
    this.value = value;
    this.contentType = contentType;
  }

  get type() {
    return 'string';
  }

  _serialize(type) {
    let { contentType, value } = this;
    if(type === 'document') {
      return {
        content_type: contentType,
        data: value
      };
    } else {
      return {
        type: this.type,
        content_type: contentType,
        value
      };
    }
  }

}
