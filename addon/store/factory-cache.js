import Mixin from '@ember/object/mixin';

export default Mixin.create({

  _factoryFor() {
    return this.get('stores')._factoryFor(...arguments);
  }

});
