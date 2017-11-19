import EmberObject from '@ember/object';
import ModelMixin from './-model-mixin';
import {
  createLoaderStateMixin,
  createForwardStateMixin
} from './-create-loader-state-mixin';
import { keys } from './internal/-paginated-loader-state';
import { promise } from './-properties';

export const ForwardStateMixin = createForwardStateMixin('loader', keys);

const LoaderStateMixin = createLoaderStateMixin(keys);

export default EmberObject.extend(ModelMixin, LoaderStateMixin, {

  load:     promise('load'),
  loadMore: promise('loadMore'),
  reload:   promise('reload')

});
