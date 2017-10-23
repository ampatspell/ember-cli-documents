import proxy from './-proxy';
import { keys } from './query-loader';
import { makeForwardStateMixin } from './-create-loader-state-mixin';

const ForwardStateMixin = makeForwardStateMixin('loader', keys);

export default Class => proxy(Class).extend(ForwardStateMixin);
