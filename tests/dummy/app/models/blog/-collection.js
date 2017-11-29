import { Models, models, find, prop } from 'documents';
import { findByType } from '../-props';

export const collection = ({ type }) => models({
  create(owner) {
    let database = owner.get('database');
    return {
      type: `blog/${type}`,
      props: { database }
    }
  }
});

export default Models.extend({

  type: null,

  source: findByType({ type: prop('type') }),

  model: {
    observe: [],
    create(doc, models) {
      let type = models.get('type');
      return {
        type: `blog/${type}`,
        props: { doc }
      };
    }
  },

  async load() {
    await this.get('source').load();
  }

});
