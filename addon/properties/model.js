import model from './-model';
import createExtendable from './-create-extendable';

let extendable = createExtendable({
  arrays: [ 'owner' ],
  functions: [ 'create' ]
});

export default extendable(model);
