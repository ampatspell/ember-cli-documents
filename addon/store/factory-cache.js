import Mixin from '@ember/object/mixin';
import { getOwner } from '@ember/application';
import { object } from '../util/computed';

export default Mixin.create({

  _factoryCache: object().readOnly(),

  _factoryFor(factoryName) {
    let cache = this.get('_factoryCache');
    let Factory = cache[factoryName];
    if(!Factory) {
      Factory = getOwner(this).factoryFor(factoryName);
      cache[factoryName] = Factory;
    }
    return Factory;
  }

});
