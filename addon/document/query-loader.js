import Ember from 'ember';
import ModelMixin from './-model-mixin';
import { createLoaderStateMixin, createForwardStateMixin } from './-create-loader-state-mixin';
import { keys } from './internal/-query-loader-state';
import { promise } from './-properties';

export const ForwardStateMixin = createForwardStateMixin('loader', keys);

const LoaderStateMixin = createLoaderStateMixin(keys);

export default Ember.Object.extend(ModelMixin, LoaderStateMixin, {

  _internal: null,

  load:   promise('load'),
  reload: promise('reload')

});
