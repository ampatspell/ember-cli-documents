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

}
