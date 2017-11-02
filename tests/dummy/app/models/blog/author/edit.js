import { computed } from '@ember/object';
import { Model } from 'documents';

export default Model.extend({

  doc: null,

  // TODO: changeset

  id: computed('doc.{id,name,isNew}', function() {
    let { id, name, isNew }  = this.get('doc').getProperties('id', 'name', 'isNew');
    if(!isNew) {
      return id;
    }
    name = name.trim().toLowerCase().replace(/ /g, '-');
    if(!name) {
      return;
    }
    return `author:${name}`;
  }),

  async save() {
    let doc = this.get('doc');
    if(doc.get('isNew')) {
      let id = this.get('id');
      doc.set('id', id);
      if(!id) {
        throw doc.onError({ error: 'forbidden', reason: 'name' });
      }
    }
    await doc.save();
  }

});
