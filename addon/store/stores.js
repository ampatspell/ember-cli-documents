import Mixin from '@ember/object/mixin';

export default Mixin.create({

  stores: null,
  identifier: null,

  _adapter: null,
  _opts: null,

  toStringExtension() {
    return this.get('identifier');
  },

  willDestroy() {
    this.get('stores')._storeWillDestroy(this);
    this._super();
  }

});
