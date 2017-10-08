import Ember from 'ember';
import first from './first';

const {
  merge
} = Ember;

export default opts => {
  opts = merge({ database: 'database', id: 'id' }, opts);
  let { database, id } = opts;

  return first({
    database,
    properties: { id },
    query(props) {
      let { id } = props;
      return { id };
    },
    matches(doc, props) {
      let { id } = props;
      return doc.get('id') === id;
    }
  });
};
