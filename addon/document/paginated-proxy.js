import ArrayProxy from '@ember/array/proxy';
import ProxyMixin, { loader } from './-proxy-mixin';
import { ForwardStateMixin } from './paginated-loader';

export default ArrayProxy.extend(ProxyMixin, ForwardStateMixin, {

  all: null,

  loadMore: loader('loadMore')

});
