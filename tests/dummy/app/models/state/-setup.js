import Mixin from '@ember/object/mixin';
import { all } from 'rsvp';
import { Error } from 'documents';

/* global emit */
const ddocs = {
  main: {
    version: 1,
    views: {
      'by-type': {
        map(doc) {
          emit(doc.type);
        }
      }
    }
  },
  blog: {
    version: 1,
    views: {
      'by-owner': {
        map(doc) {
          if(doc.type !== 'blog') {
            return;
          }
          emit(doc.owner);
        }
      }
    }
  }
};

export default Mixin.create({

  async _recreateDatabase() {
    return await this.get('database.documents.database').recreate();
  },

  async _insertDesignDocuments() {
    let design = this.get('database.documents.design');
    let promises = [];
    for(let key in ddocs) {
      let value = ddocs[key];
      promises.push(design.save(key, value));
    }
    return await all(promises);
  },

  async setup() {
    let recreate = await this._recreateDatabase();
    let design = await this._insertDesignDocuments();
    return { recreate, design };
  },

  async _needsSetup() {
    let doc = await this.get('database.documents.design').load('main', { optional: true });
    if(!doc || doc.version !== ddocs.main.version) {
      throw new Error({ error: 'state', reason: 'needs_setup' });
    }
  }

});
