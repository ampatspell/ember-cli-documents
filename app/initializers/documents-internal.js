import Stores from 'documents/stores';
import Store from 'documents/store';
import Session from 'documents/session';
import Database from 'documents/database';
import DatabaseSecurity from 'documents/security';
import DatabaseSecurityPair from 'documents/security-pair';
import Document from 'documents/document/document';
import DocumentObject from 'documents/document/object';
import DocumentArray from 'documents/document/array';
import InternalDocument from 'documents/document/internal/document';
import InternalObject from 'documents/document/internal/object';
import InternalArray from 'documents/document/internal/array';
import AdapterCouch from 'documents/adapter/couch';

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

    container.register('documents:internal/document', InternalDocument);
    container.register('documents:internal/object', InternalObject);
    container.register('documents:internal/array', InternalArray);

    container.register('documents:store/adapter/couch', AdapterCouch);
  }
};
