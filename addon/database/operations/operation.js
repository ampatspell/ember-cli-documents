import Ember from 'ember';

const {
  RSVP: { defer }
} = Ember;

export default class Operation {

  constructor() {
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

}
