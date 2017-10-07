import Ember from 'ember';
import layout from './template';

const {
  computed
} = Ember;

export default Ember.Component.extend({
  layout,

  id: 'message:first',

  proxy: computed(function() {
    let internal = this.get('store')._createInternalDocumentProxy({ });
    let model = internal.model(true);
    return model;
  })

});
