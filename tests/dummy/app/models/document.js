import { Model } from 'documents';
import LifecycleMixin from './-lifecycle-mixin';

export default Model.extend(LifecycleMixin, {

  doc: null,

  toStringExtension() {
    return this.get('doc.id');
  }

});
