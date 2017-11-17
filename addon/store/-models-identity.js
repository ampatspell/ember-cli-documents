import Ember from 'ember';
import TransformMixin from '../util/immutable-array-transform-mixin';

export default Ember.ArrayProxy.extend(TransformMixin);
