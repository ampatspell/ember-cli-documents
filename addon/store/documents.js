import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Mixin.create({

  documents: computed(function() {
    let adapter = this.get('adapter');
    return adapter.storeDocuments(this);
  }).readOnly()

});
