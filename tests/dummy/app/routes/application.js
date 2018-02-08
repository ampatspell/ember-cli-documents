import Route from '@ember/routing/route';

export default Route.extend({

  async beforeModel() {
    // let state = this.get('state');
    // let results = await state.restore();
    // if(results.setup.needed) {
    //   this.transitionTo('setup');
    // }
  }

});
