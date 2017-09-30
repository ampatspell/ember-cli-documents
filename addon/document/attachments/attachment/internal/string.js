import Content from './-base';

export default class StringContent extends Content {

  constructor(store, data, contentType) {
    super(store);
    this.data = data;
    this.contentType = contentType;
  }

  get type() {
    return 'string';
  }

  serialize() {
    let { contentType, data } = this;
    return {
      content_type: contentType,
      data
    };
  }

}
