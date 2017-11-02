import model from './-model';
import createExtendable from './-create-extendable';

let extendable = createExtendable({
  arrays: [ 'dependencies' ],
  functions: [ 'create' ]
});

export default extendable(model);
