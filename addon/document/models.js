import ArrayProxy from '@ember/array/proxy';
import ModelMixin from './-model-mixin';
import TransformMixin from './-array-transform-mixin';
import { property } from './-properties';

const store = property('store');

const Models = ArrayProxy.extend(ModelMixin, TransformMixin, {

  store: store()

});

const GeneratedModels = Models.extend({
  toStringExtension() {
    return '(generated)';
  }
});

GeneratedModels.reopenClass({ isGenerated: true });

export const generate = () => GeneratedModels.extend();

export default Models;
