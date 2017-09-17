import Ember from 'ember';

const {
  get,
  A
} = Ember;

export default hash => Ember.Mixin.create({

  objectAtContent(idx) {
    let object = A(get(this, 'arrangedContent')).objectAt(idx);
    return hash.public.call(this, object);
  },

  replaceContent(idx, amt, objects) {
    objects = A(objects).map(object => {
      return hash.internal.call(this, object);
    });
    this._super(idx, amt, objects);
  }

});
