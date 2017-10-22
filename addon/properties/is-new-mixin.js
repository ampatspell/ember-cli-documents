import Ember from 'ember';
import { prop } from './index';

const {
  merge,
  typeOf
} = Ember;

export default extendable => extendable.extend(opts => {
  opts = merge({ new: undefined }, opts);
  opts.new = prop.wrap(opts.new);
  return {
    owner: [ opts.new.key() ],
    document: [ 'isNew' ],
    matches(doc, owner) {
      if(this._super && !this._super(doc, owner)) {
        return;
      }

      let value = opts.new.value(owner);
      let type = typeOf(value);

      if(type === 'null' || type === 'undefined') {
        return true;
      }

      return doc.get('isNew') === !!value;
    }
  };
});
