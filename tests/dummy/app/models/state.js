import { Model, model } from 'documents';
import { hash } from 'rsvp';
import LifecycleMixin from './-lifecycle-mixin';

const state = type => model({
  create(state) {
    return {
      type: `state/${type}`,
      props: state.getProperties('store', 'database')
    };
  }
});

export default Model.extend(LifecycleMixin, {

  store: null,
  database: null,

  session: state('session'),
  changes: state('changes'),
  setup:   state('setup'),

  async restore() {
    return await hash({
      changes: this.get('changes').start(),
      session: this.get('session').restore(),
      setup:   this.get('setup').validate()
    });
  }

});
