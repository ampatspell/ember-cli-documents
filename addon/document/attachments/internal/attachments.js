import Ember from 'ember';
import Base, { empty } from '../../internal/base';
import MutateMixin from '../../internal/-mutate-mixin';
import EmptyObject from 'documents/util/empty-object';

import {
  toInternal,
  isInternal,
  isInternalAttachment
} from 'documents/util/internal';

const {
  typeOf,
  Logger: { error }
} = Ember;

export default class Attachments extends MutateMixin(Base) {

  constructor(store, document) {
    super(store, document);
    this.values = new EmptyObject();
  }

  _createModel() {
    return this.store._createAttachmentsModel(this);
  }

  _createInternalAttachment(props) {
    return this.store._createInternalAttachment(this, props);
  }

  //

  __deserializeInvalid(current, message) {
    error(message);
    return { update: false, internal: current };
  }

  __deserializeInvalidType(value_, current) {
    return this.__deserializeInvalid(current, `attachment must be db.attachment or object not ${value_}`);
  }

  __deserializeInternalAttachment(internal, current) {
    this._detachInternal(current);
    this._attachInternal(internal);
    return { update: true, internal };
  }

  __deserializeObject(value, current) {
    this._detachInternal(current);
    let internal = this._createInternalAttachment(value);
    return { update: true, internal };
  }

  __deserializePrimitive(value, value_, current) {
    let valueType = typeOf(value);
    if(valueType === 'object') {
      return this.__deserializeObject(value, current);
    } else {
      return this.__deserializeInvalidType(value_, current);
    }
  }

  __deserializeValue(value, value_, current) {
    if(isInternal(value)) {
      if(value.isDetached()) {
        if(isInternalAttachment(value)) {
          return this.__deserializeInternalAttachment(value, current);
        } else {
          return this.__deserializeInvalidType(value_, current);
        }
      } else {
        return this.__deserializeInvalid(current, `attachment ${value_} is already associated with a document`);
      }
    } else {
      return this.__deserializePrimitive(value, value_, current);
    }
  }

  __deserializeUndefinedValue(current) {
    this._detachInternal(current);
    return { update: true, internal: undefined };
  }

  _deserializeValue(value_, current) {
    let value = toInternal(value_);

    if(current === value) {
      return {
        update: false,
        internal: value
      };
    }

    if(current === empty) {
      current = undefined;
    }

    if(value) {
      return this.__deserializeValue(value, value_, current);
    } else {
      return this.__deserializeUndefinedValue(current);
    }
  }

  //

  _serializeValue(value, type) {
    return value._serialize(type);
  }

  _serialize(type) {
    let json = super._serialize(type);
    if(Object.keys(json).length === 0) {
      return;
    }
    return json;
  }

}
