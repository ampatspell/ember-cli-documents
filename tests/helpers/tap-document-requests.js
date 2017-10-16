import Ember from 'ember';

const {
  copy
} = Ember;

const queryToString = (hash={}) => {
  let pairs = [];
  for(let key in hash) {
    let value = hash[key];
    if(value === undefined) {
      continue;
    }
    pairs.push(`${key}=${value}`);
  }
  return pairs.join('&');
}

class Tap {

  constructor() {
    this.requests = [];
  }

  push(opts) {
    opts = copy(opts, true);
    this.requests.push(opts);
  }

  get urls() {
    return this.requests.map(req => {
      let { method, url, qs } = req;
      method = method.toUpperCase();
      qs = queryToString(qs);
      if(qs.length > 0) {
        url = `${url}?${qs}`;
      }
      return `${method} ${url}`;
    });
  }

  clear() {
    this.requests = [];
  }

}

export default docs => {
  let tap = new Tap();
  let fn = docs.request;
  docs.request = function(opts) {
    tap.push(opts);
    return fn.call(docs, opts);
  }
  return tap;
}
