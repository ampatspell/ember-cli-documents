import { A } from '@ember/array';
import Content from './-base';

export const mapping = {
  contentType: 'content_type',
  digest: 'digest',
  revpos: 'revpos',
  length: 'length'
};

const keys = A(Object.keys(mapping));

export default class StubContent extends Content {

  constructor(store, props) {
    super(store);
    this.props = props;
  }

  get location() {
    return 'remote';
  }

  get type() {
    return 'stub';
  }

  _notifyPropertiesChanged() {
    let model = this.model(false);
    if(!model) {
      return;
    }
    model.beginPropertyChanges();
    keys.forEach(key => model.notifyPropertyChange(key));
    model.endPropertyChanges();
  }

  _setProps(props) {
    this.props = props;
    this._notifyPropertiesChanged();
  }

  _serialize() {
    return this.props;
  }

  deserialize(props) {
    if(props && props.stub === true) {
      this._setProps(props);
      return true;
    }
    return false;
  }

}
