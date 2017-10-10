import Ember from 'ember';
import DocumentsError from '../util/error';

const {
  RSVP: { defer, resolve, reject }
} = Ember;

export default class Operation {

  constructor(label, props, fn, before, resolve) {
    this.label = label;
    this.props = props;
    this.fn = fn;
    this.before = before;
    this.resolve = resolve;
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

  _invokeBefore() {
    if(this.before) {
      return this.before();
    }
  }

  _invokeResolve(arg) {
    if(this.resolve) {
      return this.resolve(arg);
    }
    return arg;
  }

  _invoke() {
    if(this.destroyed) {
      return reject(new DocumentsError({ error: 'internal', reason: 'operation_destroyed' }));
    }

    return resolve()
      .then(() => this._invokeBefore())
      .then(() => this.fn())
      .then(result => this._invokeResolve(result));
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
