import Ember from 'ember';
import proxy from './-query-proxy';

const {
  computed: { reads }
} = Ember;

export default proxy(Ember.ObjectProxy).extend({

  content: reads('filter.value').readOnly()

});
