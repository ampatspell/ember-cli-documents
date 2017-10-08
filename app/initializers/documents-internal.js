import Stores from 'documents/stores';
import StoresIdentity from 'documents/stores/-identity';

import Store from 'documents/store';
import StoreIdentity from 'documents/store/-identity';
import Session from 'documents/session';

import Database from 'documents/database';
import DatabaseIdentity from 'documents/database/-identity';
import DatabaseSecurity from 'documents/security';
import DatabaseSecurityPair from 'documents/security-pair';

import Document from 'documents/document/document';
import InternalDocument from 'documents/document/internal/document';
import DocumentObject from 'documents/document/object';
import InternalObject from 'documents/document/internal/object';
import DocumentArray from 'documents/document/array';
import InternalArray from 'documents/document/internal/array';

import DocumentAttachments from 'documents/document/attachments/attachments';
import InternalDocumentAttachments from 'documents/document/attachments/internal/attachments';
import DocumentAttachment from 'documents/document/attachments/attachment';
import InternalDocumentAttachment from 'documents/document/attachments/internal/attachment';
import AttachmentString from 'documents/document/attachments/attachment/string';
import InternalAttachmentString from 'documents/document/attachments/attachment/internal/string';
import AttachmentStub from 'documents/document/attachments/attachment/stub';
import InternalAttachmentStub from 'documents/document/attachments/attachment/internal/stub';
import AttachmentFile from 'documents/document/attachments/attachment/file';
import InternalAttachmentFile from 'documents/document/attachments/attachment/internal/file';

import InternalDatabaseChanges from 'documents/changes/database/internal';
import DatabaseChanges from 'documents/changes/database/changes';
import InternalStoreChanges from 'documents/changes/store/internal';
import StoreChanges from 'documents/changes/store/changes';

import AdapterCouchStore from 'documents/adapter/couch/store';
import AdapterCouchDatabase from 'documents/adapter/couch/database';

export default {
  name: 'documents:internal',
  initialize(container) {
    container.register('documents:stores', Stores);

    container.register('documents:store', Store);
    container.register('documents:session', Session);
    container.register('documents:database', Database);

    container.register('documents:database/security', DatabaseSecurity);
    container.register('documents:database/security/pair', DatabaseSecurityPair);

    container.register('documents:document', Document);
    container.register('documents:object', DocumentObject);
    container.register('documents:array', DocumentArray);

    container.register('documents:attachments', DocumentAttachments);
    container.register('documents:attachment', DocumentAttachment);
    container.register('documents:attachment/string', AttachmentString);
    container.register('documents:attachment/file', AttachmentFile);
    container.register('documents:attachment/stub', AttachmentStub);

    container.register('documents:internal/document', InternalDocument);
    container.register('documents:internal/object', InternalObject);
    container.register('documents:internal/array', InternalArray);

    container.register('documents:internal/attachments', InternalDocumentAttachments);
    container.register('documents:internal/attachment', InternalDocumentAttachment);
    container.register('documents:internal/attachment/string', InternalAttachmentString);
    container.register('documents:internal/attachment/file', InternalAttachmentFile);
    container.register('documents:internal/attachment/stub', InternalAttachmentStub);

    container.register('documents:adapter/couch/store', AdapterCouchStore);
    container.register('documents:adapter/couch/database', AdapterCouchDatabase);

    container.register('documents:changes/database', DatabaseChanges);
    container.register('documents:changes/store', StoreChanges);

    container.register('documents:internal/changes/database', InternalDatabaseChanges);
    container.register('documents:internal/changes/store', InternalStoreChanges);

    container.register('documents:stores/identity', StoresIdentity);
    container.register('documents:store/identity', StoreIdentity);
    container.register('documents:database/identity', DatabaseIdentity);
  }
};
