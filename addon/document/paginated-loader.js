import Ember from 'ember';
import ModelMixin from './-model-mixin';
import createLoaderStateMixin from './-create-loader-state-mixin';
import { keys } from './internal/-paginated-loader-state';
import { promise } from './-properties';

export {
  keys
};

const LoaderStateMixin = createLoaderStateMixin(keys);

export default Ember.Object.extend(ModelMixin, LoaderStateMixin, {

  _internal: null,

  load:     promise('load'),
  loadMore: promise('loadMore'),
  reload:   promise('reload')

});
