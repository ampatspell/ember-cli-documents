import Ember from 'ember';

export default Ember.Route.extend({

  async model(params) {
    let id = `author:${params.author_id}`;
    return await this.get('state.blog.authors').modelById('blog/author/show', id);
  },

  serialize(doc) {
    return {
      author_id: doc.get('id').split(':')[1]
    };
  }

});
