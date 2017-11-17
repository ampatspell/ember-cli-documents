import Base from './-model';

export default class InternalModel extends Base {

  _createModel() {
    return this.store._createModel(this);
  }

  _didDestroyModel() {
    super._didDestroyModel();
    this.store._didDestroyInternalModel(this);
  }

}
