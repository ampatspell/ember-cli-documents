import Ember from 'ember';
import model from 'documents/properties/model';

const {
  merge
} = Ember;

const owner = key => model.extend(() => ({
  create(owner) {
    return merge({ [key]: owner }, this._super && this._super(...arguments));
  }
}));

export const state = owner('state');
export const blog = owner('blog');

// doc: null,
// author: doc({ doc: 'doc', type: 'blog/author/show' }),
export const doc = model.extend(opts => ({
  dependencies: [ opts.doc ],
  database: `${opts.doc}.database`,
  create(owner) {
    let doc = owner.get(opts.doc);
    if(!doc) {
      return;
    }
    return { doc };
  }
}));
