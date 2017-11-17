import Ember from 'ember';
import { omit } from 'documents/util/object';
import destroyable from './-destroyable';
import { withDefinition } from './-meta';

const {
  merge
} = Ember;

const proxy = type => opts => {
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

export const first     = proxy('first');
export const find      = proxy('find');
export const paginated = proxy('paginated');
