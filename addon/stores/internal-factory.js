import Mixin from '@ember/object/mixin';

export default Mixin.create({

  _documentsInternalFactory(factoryName) {
    return this._factoryFor(`documents:internal/${factoryName}`).class;
  }

});
