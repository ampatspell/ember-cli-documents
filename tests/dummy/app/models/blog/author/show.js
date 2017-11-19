import { readOnly } from '@ember/object/computed';
import { Model } from 'documents';
import LogMixin from '../../-log-mixin';

export default Model.extend(LogMixin, {

  doc: null,

  id: readOnly('doc.id'),
  name: readOnly('doc.name'),
  email: readOnly('doc.email'),

  // TODO: readOnly attrs check out how would I implement owned blogs

  toStringExtension() {
    let id = this.get('id');
    return id;
  }

});
