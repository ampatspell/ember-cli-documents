import Mixin from '@ember/object/mixin';

export default Mixin.create({

  proxy(type, owner, opts) {
    return this._createInternalProxy(type, owner, opts).model(true);
  }

});
