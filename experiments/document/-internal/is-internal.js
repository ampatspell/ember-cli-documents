import Ember from 'ember';

const {
  get
} = Ember;

const __documents_internal__ = '__documents_internal__';

export const markInternal = (name, Class) => Class.reopenClass({
  [__documents_internal__]: name
});

export default object => {
  return object && get(object.constructor, __documents_internal__);
};
