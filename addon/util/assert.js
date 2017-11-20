import DocumentsError  from './error';
import Base from 'couch/util/assert-base';

let {
  assert,
  notBlank_,
  notBlank,
  isString_,
  isString,
  isObject_,
  isObject,
  isClass_,
  isClass,
  isFunction_,
  isFunction,
  isArray_,
  isArray,
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
  isClass_,
  isClass,
  isFunction_,
  isFunction,
  isArray_,
  isArray,
  isBoolean_,
  isBoolean,
  isOneOf
}

export default assert;
