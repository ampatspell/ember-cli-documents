import Ember from 'ember';
import DocumentObject from './object';

// const {
//   computed,
//   computed: { reads },
//   copy
// } = Ember;

// const id = () => {
//   return computed('_id', {
//     get() {
//       return this._internal.getId();
//     },
//     set(_, value) {
//       return this._internal.setId(value);
//     }
//   });
// };

// const rev = () => computed('_rev', function() {
//   return this._internal.getValue('_rev');
// }).readOnly();

// const database = () => reads('_internal.database').readOnly();

export default DocumentObject.extend({


  // id: id(),
  // rev: rev(),

  // database: database()

});
