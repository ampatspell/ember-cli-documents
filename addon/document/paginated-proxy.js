import Ember from 'ember';
import proxy, { loader } from './-proxy';
import { keys } from './paginated-loader';
import { makeForwardStateMixin } from './-create-loader-state-mixin';

const ForwardStateMixin = makeForwardStateMixin('loader', keys);

export default proxy(Ember.ArrayProxy).extend(ForwardStateMixin, {

  all: null,

  loadMore: loader('loadMore')

});
