import { Model, model } from 'documents';
import { hash } from 'rsvp';
import LifecycleMixin from './-lifecycle-mixin';

const state = type => model({
  create() {
    return {
      type: `state/${type}`
    };
  }
});

export default Model.extend(LifecycleMixin, {

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
