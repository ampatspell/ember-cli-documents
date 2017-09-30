import InternalBase from '../document/internal/base';

export const isDocumentModel = 'isDocumentModel';

export const isInternal = arg => arg instanceof InternalBase;
export const isInternalArray = value => value && isInternal(value) && value.constructor.type === 'array';
export const isInternalObject = value => value && isInternal(value) && value.constructor.type === 'object';
export const isInternalAttachment = value => value && isInternal(value) && value.constructor.type === 'attachment';

export const markModel = Class => Class.reopenClass({
  [isDocumentModel]: true
});

export const isModel = instance => instance && instance.constructor[isDocumentModel] === true;

export const toInternal = value => isModel(value) ? value._internal : value;
export const toModel = value => isInternal(value) ? value.model(true) : value;
