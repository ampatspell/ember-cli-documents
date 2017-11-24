import Model from './-base';
import { byType } from '../../-props';

const type = 'author';

export default Model.extend({

  type,

  docs: byType({ type }),

  createNew() {
    return this.get('database').doc({ type, name: 'Unnamed' });
  }

});
