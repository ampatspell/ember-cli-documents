import Ember from 'ember';

export default Ember.Mixin.create({

  _modelFactory(factoryName) {
    return this._factoryFor(`documents:${factoryName}`);
  },

  _createDocumentModel(_internal) {
    return this._modelFactory('document').create({ _internal });
  },

  _createObjectModel(_internal) {
    return this._modelFactory('object').create({ _internal });
  },

  _createArrayModel(_internal) {
    let content = _internal.values;
    return this._modelFactory('array').create({ _internal, content });
  }

});
