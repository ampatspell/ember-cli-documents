import { helper } from '@ember/component/helper';
import { typeOf } from '@ember/utils';

export function join(params, hash) {
  let delimiter = hash.delimiter || '';
  let [ arr ] = params;
  if(typeOf(arr) !== 'array') {
    return;
  }
  return arr.join(delimiter);
}

export default helper(join);
