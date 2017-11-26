import Route from '@ember/routing/route';

export default Route.extend({

  async beforeModel() {
    try {
     await this.get('state').restore();
    } catch(err) {
      if(err.reason === 'needs_setup') {
        this.transitionTo('setup');
      } else {
        throw err;
      }
    }
  }

});
