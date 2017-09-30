import Ember from 'ember';
import Adapter from '../store';

const {
  getOwner,
  computed
} = Ember;

const couch = () => computed('url', function() {
  let couches = getOwner(this).lookup('couch:couches');
  let opts = this.getProperties('url');
  return couches.couch(opts);
}).readOnly();

export default Adapter.extend({

  couch: couch(),

  url: null,

  storeDocuments() {
    return this.get('couch');
  },

  changesListener(opts) {
    let couch = this.get('couch');
    return couch.createChanges(opts);
  }

}).reopenClass({

  identifierFor(opts) {
    return `couch-${opts.url}`;
  }

});
