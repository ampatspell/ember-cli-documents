import Ember from 'ember';
import { toModel } from 'documents/util/internal';

const {
  A
} = Ember;

const wrapMatch = opts => {
  if(typeof opts.match === 'function') {
    let fn = opts.match;
    opts.match = internal => {
      let doc = toModel(internal);
      return fn.call(null, doc);
    }
  }
  return opts;
}

export default Ember.Mixin.create({

  find(opts) {
    return this._internalDocumentFind(opts).then(({ type, result }) => {
      if(type === 'single') {
        return result.model(true);
      }
      return A(result.map(internal => internal.model(true)));
    });
  },

  first(opts) {
    opts = wrapMatch(this._normalizeInternalFindOptions(opts));
    return this._internalDocumentFirst(opts).then(internal => internal.model(true));
  }

});
