import { Model } from 'documents';
import { collection }  from './-collection';

export default Model.extend({

  authors: collection({ type: 'authors' })

});
