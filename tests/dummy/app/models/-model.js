import { model } from 'documents';

const owner = key => opts => model({
  _identifier: 'app/models/-model/owner',
  create(owner) {
    return {
      type: opts.type,
      props: {
        [key]: owner
      }
    };
  }
});

export const state = owner('state');
export const blog = owner('blog');

// doc: null,
// author: doc({ doc: 'doc', type: 'blog/author/show' }),
export const doc = opts => model({
  _identifier: 'app/models/-model/doc',
  owner: [ opts.doc ],
  database: `${opts.doc}.database`,
  type: opts.type,
  create(owner) {
    let doc = owner.get(opts.doc);
    if(!doc) {
      return;
    }
    return {
      type: opts.type,
      props: {
        doc
      }
    };
  }
});
