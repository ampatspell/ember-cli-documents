import Ember from 'ember';
import { property } from '../../-properties';

const type = property('type');

export default Ember.Object.extend({

  _internal: null,

  type: type(),

  willDestroy() {
    this._internal._modelWillDestroy();
    this._super();
  }

});
