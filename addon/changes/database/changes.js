import { property } from 'documents/document/-properties';
import Changes from '../changes';

const database = property('database');

export default Changes.extend({

  database: database()

});
