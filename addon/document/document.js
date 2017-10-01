import DocumentObject from './object';
import StateMixin from './-state-mixin';
import SerializedMixin from './-serialized-mixin';
import { forward, property, promise } from './-properties';

const id          = forward('getId', 'setId');
const rev         = forward('getRev');
const attachments = forward('getAttachments', 'setAttachments');
const database    = property('database');

export default DocumentObject.extend(StateMixin, SerializedMixin, {

  id: id(),
  rev: rev(),
  attachments: attachments(),

  database: database(),

  save:   promise('scheduleSave'),
  load:   promise('scheduleLoad'),
  reload: promise('scheduleReload'),
  delete: promise('scheduleDelete'),

  toStringExtension() {
    let database = this.get('database.identifier');
    let id = this.get('id') || '';
    return `${database}/${id}`;
  }

});
