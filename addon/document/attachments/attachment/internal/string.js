import Content from './-base';

export default class StringContent extends Content {

  constructor(store, value, contentType) {
    super(store);
    this.value = value;
    this.contentType = contentType;
  }

  get type() {
    return 'string';
  }

  serialize(type) {
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
