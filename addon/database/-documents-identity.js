import ArrayProxy from '@ember/array/proxy';
import TransformMixin from 'documents/util/immutable-array-transform-mixin';

export default ArrayProxy.extend(TransformMixin);
