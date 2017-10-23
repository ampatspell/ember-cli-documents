import Ember from 'ember';
import { isOneOf } from 'documents/util/assert';
import registerDestroy from 'documents/util/register-destroy';

const factories = {
  first:     '_createInternalDocumentProxy',
  find:     '_createInternalArrayProxy',
  paginated: '_createInternalPaginatedProxy'
};

const factoryKeys = Object.keys(factories);

export default Ember.Mixin.create({

  __createInternalProxy(type, owner, opts) {
    isOneOf('type', type, factoryKeys);
    let name = factories[type];
    let fn = this[name];
    return fn.call(this, owner, opts);
  },

  _createInternalProxy(type, owner, opts={}) {
    let internal = this.__createInternalProxy(type, owner, opts);
    registerDestroy(owner, () => internal.destroy());
    return internal;
  }

});