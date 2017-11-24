import { Model, model } from 'documents';
import { hash } from 'rsvp';

const state = type => model({
  create() {
    return {
      type
    };
  }
});

export default Model.extend({

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
