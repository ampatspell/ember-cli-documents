import createExtendable from './-create-extendable';

import {
  first as first_,
  find as find_,
  paginated as paginated_
} from './proxy';

let extendable = createExtendable({
  arrays: [ 'owner', 'document' ],
  functions: [ 'query', 'matches', 'loaded' ]
});

export const first     = extendable(first_);
export const find      = extendable(find_);
export const paginated = extendable(paginated_);
