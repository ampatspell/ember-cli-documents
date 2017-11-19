import ArrayProxy from '@ember/array/proxy';
import ProxyMixin from './-proxy-mixin';
import { ForwardStateMixin } from './query-loader';

export default ArrayProxy.extend(ProxyMixin, ForwardStateMixin);
