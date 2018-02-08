import { Models, database } from 'documents';
import LifecycleMixin from '../-lifecycle-mixin';

export default Models.extend(LifecycleMixin, {

  database: database('remote', 'main'),

  actions: {
    enable() {
    }
  }

});
