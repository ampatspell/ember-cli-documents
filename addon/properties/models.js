import models from './-models';
import createExtendable from './-create-extendable';

let extendable = createExtendable({
  arrays: [ 'owner' ],
  functions: [ 'source', 'create' ]
});

export default extendable(models);
