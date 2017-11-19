import ObjectProxy from '@ember/object/proxy';
import { reads } from '@ember/object/computed';
import ProxyMixin from './-proxy-mixin';
import { ForwardStateMixin } from './query-loader';

export default ObjectProxy.extend(ProxyMixin, ForwardStateMixin, {

  content: reads('filter.value').readOnly()

});
