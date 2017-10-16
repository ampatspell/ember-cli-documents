import Ember from 'ember';
import { isOneOf } from 'documents/util/assert';
import registerDestroy from 'documents/util/register-destroy';

const {
  merge,
  copy
} = Ember;

const factories = {
  first:     '_createInternalDocumentProxy',
  find:     '_createInternalArrayProxy',
  paginated: '_createInternalPaginatedProxy'
};

const factoryKeys = Object.keys(factories);

const defaultMatches = () => true;
const defaultQuery = () => {};

export default Ember.Mixin.create({

  __createInternalProxy(type, owner, opts) {
    isOneOf('type', type, factoryKeys);
    let name = factories[type];
    let fn = this[name];
    return fn.call(this, owner, opts);
  },

  __normalizeInternalProxyOpts(opts) {
    let normalized = merge({ owner: [], document: [], matches: defaultMatches, query: defaultQuery }, opts);
    let { query, matches, loaded } = normalized;
    let owner = copy(normalized.owner);
    let document = copy(normalized.document);
    return { owner, document, matches, query, loaded };
  },

  _createInternalProxy(type, owner, opts) {
    let normalizedOpts = this.__normalizeInternalProxyOpts(opts);
    let internal = this.__createInternalProxy(type, owner, normalizedOpts);
    registerDestroy(owner, () => internal.destroy());
    return internal;
  }

});
