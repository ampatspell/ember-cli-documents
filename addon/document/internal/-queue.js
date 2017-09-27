import Ember from 'ember';

const {
  run: { cancel, next }
} = Ember;

export default class Queue {

  constructor() {
    this.array = [];
    this.operation = null;
  }

  add(operation) {
    this.array.push(operation);
    this._enqueueNext();
    return operation.promise;
  }

  _enqueueNext() {
    cancel(this.__enqueueNext);
    this.__enqueueNext = next(() => this._next());
  }

  _next() {
    let op = this.operation;
    if(op) {
      return;
    }

    op = this.array.shift();
    if(!op) {
      return;
    }

    this.operation = op;

    op.promise.catch(() => {}).finally(() => {
      this.operation = null;
      this._enqueueNext();
    });

    op.invoke();
  }

}
