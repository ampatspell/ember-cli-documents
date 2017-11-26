import { Model } from 'documents';
import { all } from 'rsvp';

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

export default Model.extend({

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

  async perform() {
    let recreate = await this._recreateDatabase();
    let design = await this._insertDesignDocuments();
    return { recreate, design };
  },

  async validate() {
    let doc = await this.get('database.documents.design').load('main', { optional: true });
    if(!doc || doc.version !== ddocs.main.version) {
      return { ok: false, needed: true };
    }
    return { ok: true };
  }

});
