import Ember from 'ember';
import ModelMixin from './-model-mixin';
import TransformMixin from './-array-transform-mixin';
import { property } from './-properties';

const store = property('store');

const Models = Ember.ArrayProxy.extend(ModelMixin, TransformMixin, {

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
