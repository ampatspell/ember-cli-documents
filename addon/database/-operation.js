import Ember from 'ember';
import DocumentsError from '../util/error';

const {
  RSVP: { defer, resolve, reject },
  assign
} = Ember;

export default class Operation {

  constructor(label, props, fn, resolve) {
    this.label = label;
    this.fn = fn;
    this.resolve = resolve;
    assign(this, props);
    this.deferred = defer();
    this.destroyed = false;
  }

  _resolve(arg) {
    return this.deferred.resolve(arg);
  }

  _reject(err) {
    return this.deferred.reject(err);
  }

  get promise() {
    return this.deferred.promise;
  }

  _invoke() {
    if(this.destroyed) {
      return reject(new DocumentsError({ error: 'internal', reason: 'operation_destroyed' }));
    }
    return this.fn(this).then(result => {
      let resolve = this.resolve;
      if(resolve) {
        return resolve(result);
      }
      return result;
    });
  }

  invoke() {
    resolve()
      .then(() => this._invoke())
      .then(arg => this._resolve(arg), err => this._reject(err));
  }

  destroy() {
    this.destroyed = true;
  }

}
