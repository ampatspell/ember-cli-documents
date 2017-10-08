import Ember from 'ember';
import EmptyObject from './empty-object';

const {
  on,
  merge,
  A,
  copy
} = Ember;

class Registry {
  constructor() {
    this.keyed = new EmptyObject();
    this.all = A();
  }
  get(key) {
    return this.keyed[key];
  }
  set(key, value) {
    this.keyed[key] = value;
    this.all.pushObject(value);
    return value;
  }
  remove(key) {
    let value = this.keyed[key];
    delete this.keyed[key];
    this.all.removeObject(value);
  }
  destroy() {
    copy(this.all).forEach(object => object.destroy());
  }
}

export default opts => {
  merge({ key: '_nested' }, opts);
  return Ember.Mixin.create({
    _setupNestedRegistry: on('init', function() {
      this[opts.key] = new Registry();
    })
  });
};
