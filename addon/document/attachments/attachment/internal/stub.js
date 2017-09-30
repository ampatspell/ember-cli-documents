import Content from './-base';

export default class StubContent extends Content {

  constructor(store, props) {
    super(store);
    this.props = props;
  }

  get type() {
    return 'stub';
  }

  _serialize() {
    return this.props;
  }

}
