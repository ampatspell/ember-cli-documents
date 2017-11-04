import model from './-model';
import createExtendable from './-create-extendable';

let extendable = createExtendable({
  arrays: [ 'owner', 'document' ],
  functions: [ 'create', 'type' ]
});

export default extendable(model);
