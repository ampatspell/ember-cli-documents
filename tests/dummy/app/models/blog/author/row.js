import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import { Model, prop } from 'documents';
import { hasMany } from '../../-props';
import LogMixin from '../../-log-mixin';

export default Model.extend(LogMixin, {

  state: service(),

  doc: null,

  name: readOnly('doc.name'),
  email: readOnly('doc.email'),

  blogs: hasMany({ ddoc: 'blog', id: prop('doc.id'), prop: 'owner' }),

  toStringExtension() {
    return this.get('doc.id');
  }

});
