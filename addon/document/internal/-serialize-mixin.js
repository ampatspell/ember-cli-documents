import { isInternal } from 'documents/util/internal';

export default Class => class SerializeMixin extends Class {

  _serializeValue(value, type) {
    if(isInternal(value)) {
      value = value.withPropertyChanges(changed => value.serialize(type, changed), true);
    }
    return value;
  }

}
