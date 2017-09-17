import Ember from 'ember';

const noop = () => {};

export default Ember.Object.extend({

  store: null,
  identifier: null,

  doc(values) {
    values = values || {};
    let internal = this.get('store')._createInternalDocument();
    internal._deserialize(values, noop);
    internal.setState({ isDirty: false }, noop);
    return internal.model(true);
  },

  array(values) {
    let internal = this.get('store')._createInternalArray();
    internal._deserialize(values);
    return internal.model(true);
  },

  object(values) {
    let internal = this.get('store')._createInternalObject();
    internal._deserialize(values, noop);
    return internal.model(true);
  }

});
