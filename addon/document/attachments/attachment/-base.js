import Ember from 'ember';
import { property } from '../../-properties';

export {
  property
};

const {
  computed: { equal }
} = Ember;

const type = property('type');
const location = property('location');
const locationEqual = value => equal('location', value);

export default Ember.Object.extend({

  _internal: null,

  type: type(),

  location: location(),
  isLocal:  locationEqual('local'),
  isRemote: locationEqual('remote'),

  willDestroy() {
    this._internal._modelWillDestroy();
    this._super();
  }

});
