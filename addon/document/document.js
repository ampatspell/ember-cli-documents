import DocumentObject from './object';
import StateMixin from './-state-mixin';
import SerializedMixin from './-serialized-mixin';
import { forward, property, promise } from './-properties';

const id          = forward('_id', 'getId', 'setId');
const rev         = forward('_rev', 'getRev');
const attachments = forward('_attachments', 'getAttachments');
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
