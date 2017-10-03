import Ember from 'ember';

const {
  RSVP: { allSettled }
} = Ember;

export default Ember.Mixin.create({

  settle() {
    return allSettled(this._openDatabases().map(db => db.settle()));
  }

});
