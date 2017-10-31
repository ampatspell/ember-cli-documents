import Ember from 'ember';

export default Ember.Route.extend({
  async beforeModel() {
    await this.get('state.session').delete();
    this.transitionTo('index');
  }
});
