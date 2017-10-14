import Ember from 'ember';
import proxy from './-proxy';
import { keys } from './paginated-loader';

export default proxy(Ember.ArrayProxy, keys, {
  loadMore: 'loadMore'
});
