import Model from './-base';
import { byType } from '../../-props';

const type = 'author';

export default Model.extend({

  type,

  docs: byType({ type }),

  createNew() {
    let doc = this.get('database').doc({ type, name: 'Unnamed' });
    return this.get('database').model('blog/author/edit', { doc });
  }

});
