import Ember from 'ember';

const {
  typeOf
} = Ember;

export function join(params, hash) {
  let delimiter = hash.delimiter || '';
  let [ arr ] = params;
  if(typeOf(arr) !== 'array') {
    return;
  }
  return arr.join(delimiter);
}

export default Ember.Helper.helper(join);
