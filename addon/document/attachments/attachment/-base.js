import EmberObject from '@ember/object';
import { equal } from '@ember/object/computed';
import { property } from '../../-properties';

export {
  property
};

const type = property('type');
const location = property('location');
const locationEqual = value => equal('location', value);

export default EmberObject.extend({

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
