import Route from '@ember/routing/route';

export default Route.extend({

  async model(params) {
    let id = `author:${params.author_id}`;
    return await this.get('state.blog.authors').docById(id);
  },

  serialize(doc) {
    return {
      author_id: doc.get('id').split(':')[1]
    };
  }

});
