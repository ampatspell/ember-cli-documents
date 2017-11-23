import { readOnly } from '@ember/object/computed';
import { Model } from 'documents';
import LogMixin from '../../-log-mixin';

export default Model.extend(LogMixin, {

  doc: null,

  name: readOnly('doc.name'),
  email: readOnly('doc.email'),

  toStringExtension() {
    return this.get('doc.id');
  }

});
