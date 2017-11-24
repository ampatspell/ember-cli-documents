import { next, cancel } from '@ember/runloop';

export default class Queue {

  constructor() {
    this.array = [];
    this.operation = null;
  }

  _isIdle() {
    return !this.operation && this.array.length === 0;
  }

  add(operation) {
    let idle = this._isIdle();
    this.array.push(operation);
    if(idle) {
      this._next();
    }
    return operation;
  }

  _scheduleNext() {
    cancel(this.__scheduleNext);
    this.__scheduleNext = next(() => this._next());
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
      this._scheduleNext();
    });

    op.invoke();
  }

}
