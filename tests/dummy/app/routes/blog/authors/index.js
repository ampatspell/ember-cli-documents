import Route from '@ember/routing/route';

export default Route.extend({

  async model() {
    await this.get('state.blog.authors').load();
  }

});
