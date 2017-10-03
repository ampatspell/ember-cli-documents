import Ember from 'ember';

const {
  getOwner
} = Ember;

export default Ember.Mixin.create({

  enableFastBootWithIdentifier(identifier) {
    let fastboot = getOwner(this).lookup('service:fastboot');
    if(!fastboot) {
      return;
    }

    let shoebox = fastboot.get('shoebox');
    if(!shoebox) {
      return;
    }

    let store = this;
    if(fastboot.get('isFastBoot')) {
      shoebox.put(identifier, {
        get payload() {
          return store._serializeShoebox();
        }
      });
    } else {
      let object = shoebox.retrieve(identifier);
      if(!object) {
        return;
      }
      let payload = object.payload;
      if(!payload) {
        return;
      }
      store._deserializeShoebox(payload);
    }
  },

});