import EmberObject from '@ember/object';
import Mixin from '@ember/object/mixin';
import BaseModelMixin from './-model-mixin';
import { call } from './-properties';

export const ModelMixin = Mixin.create({
});

export const reopenModel = Model => Model.reopenClass({
  debugColumns: []
});

export default reopenModel(EmberObject.extend(BaseModelMixin, ModelMixin, {

  model: call('createModel')

}));
