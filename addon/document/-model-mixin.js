import Mixin from '@ember/object/mixin';

export default Mixin.create({

  _internal: null,

  willDestroy() {
    this._internal._modelWillDestroy();
    this._super();
  }

});
