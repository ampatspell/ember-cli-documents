import Base from './-model';

export default class InternalModel extends Base {

  _createModel() {
    return this.stores._createModel(this);
  }

  _didDestroyModel() {
    super._didDestroyModel();
    this.stores._didDestroyInternalModel(this);
  }

}
