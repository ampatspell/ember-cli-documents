import Ember from 'ember';
import Push from './-push';
import { isObject_, isString } from '../util/assert';

const {
  merge
} = Ember;

export default Ember.Mixin.create({

  doc(values) {
    if(values) {
      isObject_(`document properties must be object not ${values}`, values);
    }
    let internal = this._createNewInternalDocument(values, 'model');
    return internal.model(true);
  },

  existing(id, opts) {
    isString('id', id);
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
    if(values) {
      isObject_(`object properties must be object not ${values}`, values);
    }
    let internal = this._createInternalObject(values, 'model');
    return internal.model(true);
  },

  attachment(values) {
    isObject_(`attachment properties must be object not ${values}`, values);
    let internal = this._createInternalAttachment(values);
    return internal.model(true);
  },

  push(doc, opts) {
    isObject_(`document must be object not ${doc}`, doc);
    opts = merge({ instantiate: true }, opts);

    let internal = this._deserializeDocument(doc, 'document');

    if(opts.instantiate) {
      return internal.model(true);
    } else {
      return new Push(this, internal);
    }
  }

});
