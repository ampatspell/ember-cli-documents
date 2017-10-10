import Ember from 'ember';

const {
  get
} = Ember;

export default Class => class OwnerPropertiesMixin extends Class {

  get _properties() {
    let owner = this.owner;
    if(!owner) {
      return;
    }
    let props = {};
    let source = this.opts.owner;
    for(let key in source) {
      props[key] = get(owner, source[key]);
    }
    return props;
  }

}
