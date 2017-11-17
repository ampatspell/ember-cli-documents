import Ember from 'ember';
import makeIdentityMixin from './-make-identity-mixin';

const {
  A
} = Ember;

class ModelsByClass {
  constructor(array, modelClass) {
    this._array = array;
    this._modelClass = modelClass;
    this.values = A(this._match(array));
    this._startObserving();
  }

  _match(array) {
    let modelClass = this._modelClass;
    return A(array).filter(model => modelClass.detectInstance(model));
  }

  get _arrayObserverOptions() {
    return {
      willChange: this._arrayWillChange,
      didChange: this._arrayDidChange
    };
  }

  _startObserving() {
    this._array.addEnumerableObserver(this, this._arrayObserverOptions);
  }

  _arrayWillChange(array, removing) {
    this.values.removeObjects(removing);
  }

  _arrayDidChange(array, removeCount, adding) {
    this.values.addObjects(this._match(adding));
  }

}

class ModelsIdentityInternal {
  constructor(stores) {
    this.stores = stores;
    this._modelsByClass = A();
  }

  get _identity() {
    return this.stores.get('modelsIdentity');
  }

  modelsByClass(modelClass) {
    let hash = this._modelsByClass.findBy('modelClass', modelClass);
    if(!hash) {
      let content = new ModelsByClass(this._identity, modelClass);
      hash = { modelClass, content };
      this._modelsByClass.push(hash);
    }
    return hash.content.values;
  }

}

export default makeIdentityMixin({
  key: 'modelsIdentity',
  factory: 'models-identity',
  createInternal() {
    return new ModelsIdentityInternal(this);
  }
});
