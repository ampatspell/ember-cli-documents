import Component from '@ember/component';
import layout from './template';
import { find, models } from 'documents';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':index' ],
  layout,

  docs: find({
    database: 'state.database',
    query() {
      return { all: true }
    },
    matches() {
      return true;
    }
  }),

  models: models({
    database: 'state.database',
    owner: [ 'docs' ],
    create(owner) {
      let source = owner.get('docs');
      return {
        type: 'documents',
        source
      };
    },
    model: {
      observe: [],
      create(doc) {
        return {
          type: 'document',
          props: { doc }
        };
      }
    }
  }),

});
