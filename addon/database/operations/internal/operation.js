import Operation from '../operation';

export default class InternalDocumentOperation extends Operation {

  constructor(internal) {
    super();
    this.internal = internal;
  }

  withPropertyChanges(cb) {
    return this.internal.withPropertyChanges(cb, true);
  }

  get state() {
    return this.internal.state;
  }

}
