import Route from '@ember/routing/route';

export default Route.extend({

  async model(params) {
    return await this.get('state.blog.authors').loadById(params.author_id);
  }

});
