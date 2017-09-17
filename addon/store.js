import Ember from 'ember';
import FactoryCache from './store/factory-cache';
import InternalFactory from './store/internal-factory';
import ModelFactory from './store/model-factory';
import Databases from './store/databases';

export default Ember.Object.extend(
  FactoryCache,
  InternalFactory,
  ModelFactory,
  Databases, {

  stores: null,

  willDestroy() {
    console.log(this+' destroy');
    this._super();
  }

});
