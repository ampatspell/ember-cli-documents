import EmberObject from '@ember/object';
import ModelMixin from './-model-mixin';
import {
  createLoaderStateMixin,
  createForwardStateMixin
} from './-create-loader-state-mixin';
import { keys } from './internal/-query-loader-state';
import { promise } from './-properties';

export const ForwardStateMixin = createForwardStateMixin('loader', keys);

const LoaderStateMixin = createLoaderStateMixin(keys);

export default EmberObject.extend(ModelMixin, LoaderStateMixin, {

  load:   promise('load'),
  reload: promise('reload')

});
