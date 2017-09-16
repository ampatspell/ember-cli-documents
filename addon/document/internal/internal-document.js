import InternalObject from './internal-object';
import State from './state';

export default class InternalDocument extends InternalObject {

  constructor(database, state, values) {
    super(null, values);
    this._database = database;
    this.state = new State(state);
  }

}
