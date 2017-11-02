import { Model } from 'documents';
import { equal } from '@ember/object/computed';

export default Model.extend({

  isEmpty: equal('docs.length', 0),

  async load() {
    await this.get('docs').load();
    return this;
  }

});
