import Mixin from '@ember/object/mixin';

export default Mixin.create({

  store: null,
  identifier: null,

  toStringExtension() {
    let store = this.get('store.identifier')
    let database = this.get('identifier');
    return `${store}/${database}`;
  },

  willDestroy() {
    this.get('store')._databaseWillDestroy(this);
    this._super();
  }

});
