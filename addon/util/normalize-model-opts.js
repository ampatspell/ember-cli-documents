export default opts => {
  if(typeof opts === 'string') {
    return { type: opts };
  }
  return opts;
}
