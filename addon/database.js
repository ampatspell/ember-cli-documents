import Ember from 'ember';
import InternalFactory from './database/internal-factory';

export default Ember.Object.extend(
  InternalFactory, {

  document(values) {
    let internal = this._createInternalDocument();
    internal.withPropertyChanges(changed => {
      this._deserializeInternal(internal, values, changed);
      internal.setState({ isDirty: false }, changed);
    }, false);
    return internal;
  }

});
