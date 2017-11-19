import Mixin from '@ember/object/mixin';

export default Mixin.create({

  stores: null,

  _adapter: null,
  _opts: null,

  willDestroy() {
    this.get('stores')._storeWillDestroy(this);
    this._super();
  }

});
