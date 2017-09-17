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
  isOneOf
}

export default assert;
