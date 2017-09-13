import Ember from 'ember';
import UnknownProperty from './mixins/unknown-property';
import Serialized from './mixins/serialized';

export default Ember.Object.extend(UnknownProperty, Serialized, {

  _internal: null

});
