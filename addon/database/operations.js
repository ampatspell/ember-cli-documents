import Ember from 'ember';
import Operation from './-operation';

const {
  on,
  A,
  copy,
  run: { next },
  RSVP: { defer, allSettled }
} = Ember;

export default Ember.Mixin.create({

  __createOperations: on('init', function() {
    this._operations = new A();
  }),

  __destroyAllOperations() {
    let operations = copy(this._operations);
    operations.forEach(op => op.destroy());
  },

  __registerOperation(operation) {
    let operations = this._operations;
    operations.pushObject(operation);
    operation.promise.catch(() => {}).finally(() => operations.removeObject(operation));
  },

  _registerDatabaseOperation(operation) {
    this.__registerOperation(operation);
  },

  _registerInternalOperation(operation) {
    this.__registerOperation(operation);
  },

  __iteration() {
    let operations = this._operations;
    if(operations.get('length') === 0) {
      return;
    }
    return allSettled(operations.map(op => op.promise));
  },

  __scheduleIteration(deferred) {
    next(() => {
      let iteration = this.__iteration();
      if(!iteration) {
        deferred.resolve();
        return;
      }
      iteration.then(() => this.__scheduleIteration(deferred));
    });
  },

  settle() {
    let deferred = defer();
    this.__scheduleIteration(deferred);
    return deferred.promise;
  },

  operation(label, opts, fn) {
    let op = new Operation(label, { opts }, fn);
    this.__registerOperation(op);
    next(() => op.invoke());
    return op.promise;
  },

  willDestroy() {
    this.__destroyAllOperations();
    this._super();
  }

});
