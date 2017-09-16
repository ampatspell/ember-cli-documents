import Ember from 'ember';
import InternalFactory from './database/internal-factory';
import InternalSerialize from './database/internal-serialize';
import InternalDeserialize from './database/internal-deserialize';

export default Ember.Object.extend(
  InternalFactory,
  InternalSerialize,
  InternalDeserialize, {

  document(values) {
    let internal = this._createInternalDocument();
    internal.withPropertyChanges(changed => {
      this._deserializeInternal(internal, values, changed);
      internal.setState({ isDirty: false }, changed);
    }, false);
    return internal;
  }

});
