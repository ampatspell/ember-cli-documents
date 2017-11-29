import { models } from 'documents';
import DocumentModel, { doc } from './-document-model';

export default DocumentModel.extend({

  name: doc('name'),
  email: doc('email'),

  blogs: models({
    create(author) {
      return {
        type: 'blog/author/blogs',
        props: {
          author
        }
      };
    }
  })

});
