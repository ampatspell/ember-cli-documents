// import Ember from 'ember';
import Base from '../../internal/base';
import MutateMixin from '../../internal/-mutate-mixin';
import EmptyObject from 'documents/util/empty-object';

// import {
//   toInternal,
//   isInternal,
//   isInternalAttachment
// } from 'documents/util/internal';

// const {
//   typeOf,
//   Logger: { error }
// } = Ember;

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

  _deserializeValue(/* value, current, type */) {
    // { update, internal }
  }

  //

  // _deserializeValue(value, current, type) {
  //   let internal = toInternal(value);
  // }
      // if(current === internal) {
    //   return internal;
    // }

    // if(isInternal(internal)) {
    //   if(internal.isDetached()) {
    //     if(!isInternalAttachment(internal)) {
    //       error(`Invalid attachment ${internal}`);
    //       internal = undefined;
    //     }
    //   } else {
    //     error(`Attachment ${internal} is already associated a document`);
    //     internal = undefined;
    //   }
    // } else {
    //   let valueType = typeOf(internal);
    //   if(valueType === 'object') {
    //     internal = this._createInternalAttachment(internal);
    //   } else {
    //     error(`Invalid attachment ${internal}`);
    //     internal = undefined;
    //   }
    // }

  //

  _deserialize() {
  }

}
