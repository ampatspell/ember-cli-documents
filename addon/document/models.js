import ArrayProxy from '@ember/array/proxy';
import BaseModelMixin from './-model-mixin';
import TransformMixin from './-array-transform-mixin';
import { ModelMixin, reopenModel } from './model';

const Models = reopenModel(ArrayProxy.extend(BaseModelMixin, ModelMixin, TransformMixin));

const GeneratedModels = Models.extend({
  toStringExtension() {
    return '(generated)';
  }
});

GeneratedModels.reopenClass({ isGenerated: true });

export const generate = () => GeneratedModels.extend();

export default Models;
