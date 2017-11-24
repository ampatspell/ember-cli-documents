import ArrayProxy from '@ember/array/proxy';
import ModelMixin from './-model-mixin';
import { markModel } from 'documents/util/internal';
import TransformMixin from './-array-transform-mixin';

export default markModel(ArrayProxy.extend(ModelMixin, TransformMixin));
