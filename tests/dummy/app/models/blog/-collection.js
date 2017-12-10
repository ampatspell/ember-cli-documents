import { Models, models, prop } from 'documents';
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
  },

  findById(id) {
    return this.findBy('id', id);
  },

  async _loadById(id) {
    let type = this.get('type');
    await this.get('database').find({ id: `${type}:${id}` });
    return this.findById(id);
  },

  async loadById(id) {
    let model = this.findById(id);
    if(!model) {
      model = this._loadById(id);
    }
    return model;
  }

});
