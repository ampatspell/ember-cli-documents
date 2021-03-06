import DocumentsError  from './error';
import Base from './assert-base';

let {
  assert,
  notBlank_,
  notBlank,
  isString_,
  isString,
  isObject_,
  isObject,
  isInstance_,
  isInstance,
  isClass_,
  isClass,
  isFunction_,
  isFunction,
  isArray_,
  isArray,
  isArrayProxy_,
  isArrayProxy,
  isArrayOrArrayProxy_,
  isArrayOrArrayProxy,
  isBoolean_,
  isBoolean,
  isOneOf
} = Base(DocumentsError);

export {
  assert,
  notBlank_,
  notBlank,
  isString_,
  isString,
  isObject_,
  isObject,
  isInstance_,
  isInstance,
  isClass_,
  isClass,
  isFunction_,
  isFunction,
  isArray_,
  isArray,
  isArrayProxy_,
  isArrayProxy,
  isArrayOrArrayProxy_,
  isArrayOrArrayProxy,
  isBoolean_,
  isBoolean,
  isOneOf
}

export default assert;
