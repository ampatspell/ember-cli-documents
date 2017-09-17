import Ember from 'ember';

export default Ember.Object.extend({

  store: null,
  identifier: null,

  document(values) {
    values = values || {};

    let internal = this.get('store')._createInternalDocument();

    internal.withPropertyChanges(changed => {
      internal._deserialize(values, changed);
      internal.setState({ isDirty: false }, changed);
    }, false);

    return internal.model(true);
  }

});
