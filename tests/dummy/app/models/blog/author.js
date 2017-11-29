import DocumentModel, { doc } from './-document-model';

export default DocumentModel.extend({

  name: doc('name'),
  email: doc('email')

});
