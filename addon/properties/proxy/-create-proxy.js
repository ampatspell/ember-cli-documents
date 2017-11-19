import Ember from 'ember';
import { omit } from '../../util/object';
import destroyable from '../-destroyable';
import { withDefinition } from '../-meta';

const {
  merge
} = Ember;

export default type => opts => {
  opts = merge({ database: 'database' }, opts);
  return withDefinition(destroyable(opts.database, {
    create() {
      let database = this.get(opts.database);
      if(!database) {
        return;
      }
      return database._createInternalProxy(type, this, omit(opts, [ 'database' ]));
    }
  }), opts).readOnly();
};
