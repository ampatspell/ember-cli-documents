import Ember from 'ember';
import UnknownProperty from './mixins/unknown-property';

export default Ember.Object.extend(UnknownProperty, {

  _internal: null

});
