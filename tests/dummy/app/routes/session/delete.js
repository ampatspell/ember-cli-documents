import Route from '@ember/routing/route';

export default Route.extend({
  async beforeModel() {
    await this.get('state.session').delete();
    this.transitionTo('index');
  }
});
