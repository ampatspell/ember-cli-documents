import DocumentObject from './object';
import DocumentStateMixin from './-document-state-mixin';
import SerializedMixin from './-serialized-mixin';
import { forward, property, promise } from './-properties';

const id          = forward('getId', 'setId');
const rev         = forward('getRev');
const attachments = forward('getAttachments', 'setAttachments');
const database    = property('database');

const onError = () => function(err) {
  return this._internal.onError(err, true);
}

export default DocumentObject.extend(DocumentStateMixin, SerializedMixin, {

  id: id(),
  rev: rev(),
  attachments: attachments(),

  database: database(),

  save:   promise('save'),
  load:   promise('load'),
  reload: promise('reload'),
  delete: promise('delete'),

  onError: onError(),

  toStringExtension() {
    let store = this.get('database.store.identifier');
    let database = this.get('database.identifier');
    let id = this.get('id') || '';
    return `${store}/${database}/${id}`;
  }

});
