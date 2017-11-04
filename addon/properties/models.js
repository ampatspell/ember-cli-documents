import models from './-models';
import createExtendable from './-create-extendable';

let extendable = createExtendable({
  arrays: [ 'owner', 'document' ],
  functions: [ 'source', 'create', 'type' ]
});

export default extendable(models);
