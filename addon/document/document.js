import DocumentObject from './object';
import DocumentStateMixin from './-document-state-mixin';
import SerializedMixin from './-serialized-mixin';
import { forward, property, promise } from './-properties';

const id          = forward('getId', 'setId');
const rev         = forward('getRev');
const attachments = forward('getAttachments', 'setAttachments');
const database    = property('database');

export default DocumentObject.extend(DocumentStateMixin, SerializedMixin, {

  id: id(),
  rev: rev(),
  attachments: attachments(),

  database: database(),

  save:   promise('save'),
  load:   promise('load'),
  reload: promise('reload'),
  delete: promise('delete'),

  toStringExtension() {
    let database = this.get('database.identifier');
    let id = this.get('id') || '';
    return `${database}/${id}`;
  }

});
