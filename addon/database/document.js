import Ember from 'ember';

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

  push(doc, opts) {
    opts = merge({ instantiate: true }, opts);

    let internal = this._deserialize(doc);

    if(opts.instantiate) {
      return internal.model(true);
    } else {
      let id = internal.getId();
      let deleted = internal.isDeleted;
      return {
        id,
        deleted,
        get: opts => this.existing(id, opts)
      };
    }
  }

});
