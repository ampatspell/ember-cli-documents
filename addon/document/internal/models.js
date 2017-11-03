import Base from './-model';

export default class InternalModel extends Base {

  _createModel() {
    return this.store._createModels(this);
  }

}
