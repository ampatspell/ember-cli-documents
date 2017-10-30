import Ember from 'ember';
import { registerDestroy, destroyRegistered } from 'documents/util/register-destroy';

const {
  computed
} = Ember;

export default (...args) => {
  let { create, get } = args.pop();
  return computed(...args, function(key) {
    let cacheKey = `__ember_cli_documents__cached_${key}`;

    let { value, destroy } = this[cacheKey] || {};

    if(value) {
      destroyRegistered(this, destroy);
      delete this[cacheKey];
    }

    value = create.call(this, key);

    if(!value) {
      return;
    }

    destroy = registerDestroy(this, () => value.destroy());

    this[cacheKey] = {
      value,
      destroy
    };

    return get.call(this, value, key);
  });
}
