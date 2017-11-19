import { merge } from '@ember/polyfills';
import { omit } from '../../util/object';
import destroyable from '../-destroyable';
import { withDefinition } from '../-meta';
import { isString } from '../../util/assert';

export default type => opts => {
  opts = merge({ database: 'database' }, opts);
  isString('database', opts.database);
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
