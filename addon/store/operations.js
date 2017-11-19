import Mixin from '@ember/object/mixin';
import { allSettled } from 'rsvp';

export default Mixin.create({

  settle() {
    return allSettled(this._databases.all.map(db => db.settle()));
  }

});
