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

  serialize() {
    let { contentType, value } = this;
    return {
      content_type: contentType,
      data: value
    };
  }

}
