import { Models, find, models, database } from 'documents';
import LifecycleMixin from './-lifecycle-mixin';

export const documents = () => models({
  create() {
    return {
      type: 'documents'
    };
  }
});

export default Models.extend(LifecycleMixin, {

  database: database('remote', 'main'),

  source: find({
    query() {
      return { all: true }
    },
    matches() {
      return true;
    }
  }),

  model: {
    observe: [],
    create(doc, documents) {
      return {
        type: 'document',
        props: { documents, doc }
      };
    }
  }

});
