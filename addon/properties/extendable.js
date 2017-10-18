import extendable from './-extendable';

import {
  first as first_,
  find as find_,
  paginated as paginated_
} from './proxy';

export const first     = extendable(first_);
export const find      = extendable(find_);
export const paginated = extendable(paginated_);
