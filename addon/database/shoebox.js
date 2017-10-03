import Ember from 'ember';

const {
  A
} = Ember;

export default Ember.Mixin.create({

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
