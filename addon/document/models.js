import Ember from 'ember';
import ModelMixin from './-model-mixin';
import TransformMixin from './-array-transform-mixin';
import { property } from './-properties';

const __generated = '__generated';
const store = property('store');

const Models = Ember.ArrayProxy.extend(ModelMixin, TransformMixin, {

  store: store()

});

const GeneratedModels = Models.extend({
  toStringExtension() {
    return '(generated)';
  }
});

GeneratedModels.reopenClass({ [__generated]: true });

export const generate = () => GeneratedModels.extend();

export default Models;
