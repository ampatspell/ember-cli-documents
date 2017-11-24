import Mixin from '@ember/object/mixin';
import { A } from '@ember/array';

export default Mixin.create({

  __deserialzieShoeboxDocument(doc) {
    return this._deserializeDocument(doc, 'shoebox');
  },

  _deserializeShoebox(payload) {
    let { documents } = payload;
    return A(documents).map(doc => this.__deserialzieShoeboxDocument(doc));
  },

  __serializeShoeboxDocuments() {
    let all = this._documents.all;
    return all.reduce((arr, internal) => {
      let json = internal.serialize('shoebox');
      if(json) {
        arr.push(json);
      }
      return arr;
    }, A());
  },

  _serializeShoebox() {
    let documents = this.__serializeShoeboxDocuments();
    return {
      documents
    };
  }

});
