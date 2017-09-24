import Ember from 'ember';

const {
  merge
} = Ember;

class Push {

  constructor(database, internal) {
    this._database = database;
    this._internal = internal;
  }

  get id() {
    return this._internal.getId();
  }

  get isDeleted() {
    return this._internal.isDeleted;
  }

  get(opts) {
    return this._database.existing(this.id, opts);
  }

}

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
      return new Push(this, internal);
    }
  }

});
