import proxy from './-proxy';
import { keys } from './query-loader';

export default Class => proxy(Class, keys);
