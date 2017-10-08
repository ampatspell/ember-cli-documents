import Ember from 'ember';

const {
  RSVP: { allSettled }
} = Ember;

export default Ember.Mixin.create({

  settle() {
    return allSettled(this._databases.all.map(db => db.settle()));
  }

});
