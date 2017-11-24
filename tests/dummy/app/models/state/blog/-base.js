import { Model } from 'documents';
import { equal } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Model.extend({

  type: null,

  isEmpty: equal('docs.length', 0),

  async load() {
    await this.get('docs').load();
    return this;
  },

  async docById(id) {
    let type = this.get('type');
    return await this.get('database').first({ id, match: doc => doc.get('type') === type });
  },

  _numberOfDocuments: computed('docs.length', function() {
    return this.get('docs.length');
  })

}).reopenClass({

  debugColumns: [ 'type', '_numberOfDocuments' ]

});
