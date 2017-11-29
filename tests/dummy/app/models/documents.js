import { readOnly } from '@ember/object/computed';
import { Models, find, models, database } from 'documents';
import LifecycleMixin from './-lifecycle-mixin';

export const documents = () => models({
  create() {
    return {
      type: 'documents'
    };
  }
});

const source = ({ loadable }) => find({
  owner: [ loadable ],
  query(owner) {
    if(!owner.get(loadable)) {
      return;
    }
    return { all: true }
  },
  matches(doc, owner) {
    if(!owner.get(loadable)) {
      return false;
    }
    return true;
  }
});

export default Models.extend(LifecycleMixin, {

  database: database('remote', 'main'),

  loadable: false,

  source: source({ loadable: 'loadable' }),

  isLoading: readOnly('source.isLoading'),

  model: {
    observe: [],
    create(doc, documents) {
      return {
        type: 'document',
        props: { documents, doc }
      };
    }
  },

  actions: {
    enable() {
      this.set('loadable', true);
    }
  }

});
