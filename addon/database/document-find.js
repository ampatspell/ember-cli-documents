import Mixin from '@ember/object/mixin';
import { A } from '@ember/array';
import { toModel } from 'documents/util/internal';

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

export default Mixin.create({

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
