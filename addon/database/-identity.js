import Ember from 'ember';
import TransformMixin from 'documents/util/document-array-transform-mixin';

export default Ember.ArrayProxy.extend(TransformMixin);
