import Ember from 'ember';
import Push from './-push';

const {
  merge
} = Ember;

export default Ember.Mixin.create({

  doc(values) {
    let internal = this._createNewInternalDocument(values, 'model');
    return internal.model(true);
  },

  existing(id, opts) {
    let internal = this._existingInternalDocument(id, opts);
    if(!internal) {
      return;
    }
    return internal.model(true);
  },

  array(values) {
    let internal = this._createInternalArray(values, 'model');
    return internal.model(true);
  },

  object(values) {
    let internal = this._createInternalObject(values, 'model');
    return internal.model(true);
  },

  attachment(values) {
    let internal = this._createInternalAttachment(values, 'model');
    return internal.model(true);
  },

  push(doc, opts) {
    opts = merge({ instantiate: true }, opts);

    let internal = this._deserializeDocument(doc);

    if(opts.instantiate) {
      return internal.model(true);
    } else {
      return new Push(this, internal);
    }
  }

});
