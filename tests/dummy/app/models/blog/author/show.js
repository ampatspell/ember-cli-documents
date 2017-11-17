import Ember from 'ember';
import { Model } from 'documents';
import LogMixin from '../../-log-mixin';

const {
  computed: { readOnly }
} = Ember;

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
