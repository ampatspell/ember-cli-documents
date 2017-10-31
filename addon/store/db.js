import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Mixin.create({

  db: computed(function() {
    let _lookup = identifier => this.database(identifier);
    return this._documentsModelFactory('databases').create({ _lookup });
  }).readOnly()

});
