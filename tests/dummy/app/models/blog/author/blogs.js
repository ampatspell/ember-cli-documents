import { Models, prop } from 'documents';
import { viewByKey } from '../../-props';

export default Models.extend({

  author: null,

  init() {
    this._super(...arguments);
  },

  source: viewByKey({
    database: 'author.database',
    ddoc: 'blog',
    view: 'by-owner',
    key:  'owner',
    value: prop('author.doc.id')
  }),

  model: {
    observe: [],
    create() {

    }
  }

});
