import Ember from 'ember';
import Content from './-base';

const {
  A,
  merge
} = Ember;

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

  serialize(type) {
    let props = this.props;
    if(type === 'document') {
      return props;
    } else {
      return merge({ type: this.type }, props);
    }
  }

  deserialize(props) {
    if(props && props.stub === true) {
      this._setProps(props);
      return true;
    }
    return false;
  }

}
