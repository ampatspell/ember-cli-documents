export default opts => extendable => extendable.extend(opts_ => {
  if(typeof opts === 'function') {
    return opts(opts_);
  }
  return opts;
});
