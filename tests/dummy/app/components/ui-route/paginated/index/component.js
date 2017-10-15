import Ember from 'ember';
import layout from './template';
import { allPaginated } from 'documents/properties';

const {
  RSVP: { allSettled }
} = Ember;

/* global emit */
const ddoc = {
  views: {
    all: {
      map(doc) {
        if(doc.type !== 'duck') {
          return;
        }
        emit(doc._id);
      }
    }
  }
};

export default Ember.Component.extend({
  layout,

  docs: allPaginated({ database: 'db', ddoc: 'duck', view: 'all', limit: 3, type: 'duck' }),

  actions: {
    async setup() {
      let docs = this.get('db.documents');
      await docs.get('design').save('duck', ddoc);
      let ducks = [];
      for(let i = 0; i < 10; i++) {
        ducks.push(docs.save({ _id: `duck:${i}`, type: 'duck' }));
      }
      await allSettled(ducks);
    },
    load() {
      return this.get('docs').load();
    },
    reload() {
      return this.get('docs').reload();
    }
  }

});
