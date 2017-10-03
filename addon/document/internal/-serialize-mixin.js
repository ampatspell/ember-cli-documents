import { isInternal } from 'documents/util/internal';

export default Class => class SerializeMixin extends Class {

  _serializeValue(value, type) {
    if(isInternal(value)) {
      value = value.serialize(type);
    }
    return value;
  }

}
