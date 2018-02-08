import { Model, stores, store, database } from 'documents';
import { hash } from 'rsvp';
import LifecycleMixin from './-lifecycle-mixin';

export default Model.extend(LifecycleMixin, {

  stores:   stores(),
  store:    store('remote'),
  database: database('remote', 'main'),

  // session:  state('session'),
  // changes:  state('changes'),
  // setup:    state('setup'),

  // blog:     type('blog/state'),

  async restore() {
    return await hash({
      // changes: this.get('changes').start(),
      // session: this.get('session').restore(),
      // setup:   this.get('setup').validate()
    });
  }

});
