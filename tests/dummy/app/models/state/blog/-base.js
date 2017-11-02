import { Model } from 'documents';
import { equal } from '@ember/object/computed';

export default Model.extend({

  type: null,

  isEmpty: equal('docs.length', 0),

  async load() {
    await this.get('docs').load();
    return this;
  },

  // TODO: this.find() and this.first() if database is set

  async docById(id) {
    let type = this.get('type');
    return await this.get('database').first({ id, match: doc => doc.get('type') === type });
  },

  // TODO: this.model()

  async modelById(name, id) {
    let doc = await this.docById(id);
    return this.get('database').model(name, { doc });
  }

});
