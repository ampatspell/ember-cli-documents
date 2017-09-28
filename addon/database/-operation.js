import Ember from 'ember';

const {
  RSVP: { defer, resolve },
  assign
} = Ember;

export default class Operation {

  constructor(label, props, fn) {
    this.label = label;
    this.fn = fn;
    assign(this, props);
    this.deferred = defer();
  }

  resolve(arg) {
    return this.deferred.resolve(arg);
  }

  reject(err) {
    return this.deferred.reject(err);
  }

  get promise() {
    return this.deferred.promise;
  }

  invoke() {
    resolve()
      .then(() => this.fn(this))
      .then(arg => this.resolve(arg), err => this.reject(err));
  }

}