// store.model('thing', { ... }) => { type: 'model', props: { ... } }
export default (...args) => {
  let [ first, second ] = args;
  if(typeof first === 'string') {
    return { type: first, props: second };
  }
  return first;
}
