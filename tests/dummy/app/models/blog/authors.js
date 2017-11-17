import { Models } from 'documents';
import LogMixin from '../-log-mixin';
import models from 'documents/properties/models';

export const property = opts => models({
  owner: [ opts.docs ],
  type: 'blog/authors',
  database: `${opts.docs}.database`,
  source(owner) {
    return owner.get(opts.docs);
  },
  create(owner) {
    return {
      docs: owner.get(opts.docs),
      type: opts.model,
      create(doc) {
        return { doc };
      }
    };
  }
});

export default Models.extend(LogMixin, {

  docs: null

});
