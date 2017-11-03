import { Model } from 'documents';
import LogMixin from '../../-log-mixin';

export default Model.extend(LogMixin, {

  doc: null,

  // TODO: readOnly attrs check out how would I implement owned blogs

});
