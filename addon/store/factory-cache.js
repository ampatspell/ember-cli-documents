import Ember from 'ember';
import { object } from '../util/computed';

const {
  getOwner
} = Ember;

export default Ember.Mixin.create({

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
