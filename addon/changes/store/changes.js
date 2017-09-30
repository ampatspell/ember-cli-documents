import { property } from 'documents/document/-properties';
import Changes from '../changes';

const store = property('store');

export default Changes.extend({

  store: store()

});
