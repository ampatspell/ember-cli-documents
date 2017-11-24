import Mixin from '@ember/object/mixin';

export default Mixin.create({

  store: null,
  identifier: null,

  toStringExtension() {
    return this.get('identifier');
  },

  willDestroy() {
    this.get('store')._databaseWillDestroy(this);
    this._super();
  }

});
