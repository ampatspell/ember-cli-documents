import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({

  security: computed(function() {
    let database = this;
    return this.get('store')._factoryFor('documents:database/security').create({ database });
  }).readOnly(),

  willDestroy() {
    let security = this.get('security');
    if(security) {
      security.destroy();
    }
    this._super();
  }

});
