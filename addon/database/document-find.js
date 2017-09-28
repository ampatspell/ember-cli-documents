import Ember from 'ember';

const {
  A
} = Ember;

export default Ember.Mixin.create({

  find() {
    return this._internalDocumentFind(...arguments).then(({ type, result }) => {
      if(type === 'single') {
        return result.model(true);
      }
      return A(result.map(internal => internal.model(true)));
    });
  },

  first() {
    return this._internalDocumentFirst(...arguments).then(internal => internal.model(true));
  }

});
