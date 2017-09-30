import Ember from 'ember';

const {
  computed
} = Ember;

export default Ember.Mixin.create({

  documents: computed(function() {
    let adapter = this.get('_adapter');
    return adapter.storeDocuments(this);
  }).readOnly()

});
