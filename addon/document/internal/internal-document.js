import InternalObject from './internal-object';
import State from './state';

export default class InternalDocument extends InternalObject {

  constructor(database) {
    super(database, null);
    this.state = new State();
  }

  setState(values, changed) {
    return this.state.set(values, changed);
  }

}
