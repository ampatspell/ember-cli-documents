import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Mixin.create({

  db: computed(function() {
    let _lookup = identifier => this.database(identifier);
    return this._modelFactory('databases').create({ _lookup });
  }).readOnly()

});
