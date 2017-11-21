import { Models } from 'documents';
import LogMixin from '../-log-mixin';
import { models } from 'documents';

export const property = opts => models({
  database: `${opts.docs}.database`,
  owner: [ opts.docs ],
  create(owner) {
    let source = owner.get(opts.docs);
    return {
      source,
      type: 'blog/authors',
      props: {
        docs: source
      }
    };
  },
  model: {
    observe: [],
    create(doc) {
      return {
        type: opts.model,
        props: {
          doc
        }
      };
    }
  }
});

export default Models.extend(LogMixin, {

  docs: null

});
