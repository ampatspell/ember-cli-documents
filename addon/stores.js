import Ember from 'ember';
import StoresStore from './stores/store';
import StoresIdentity from './stores/identity';

export default Ember.Service.extend(
  StoresStore,
  StoresIdentity
);
