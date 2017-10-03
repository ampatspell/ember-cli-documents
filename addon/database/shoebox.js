import Ember from 'ember';

export default Ember.Mixin.create({

  _pushShoeboxDocument(doc) {
    return this._deserializeDocument(doc, 'shoebox');
  }

});
