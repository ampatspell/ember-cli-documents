import Ember from 'ember';
const key = '__ember_cli_documents__';

const {
  A
} = Ember;

export const destroyRegistered = (owner, fn) => {
  if(!owner) {
    return;
  }
  if(!owner.willDestroy) {
    return;
  }
  let array = owner.willDestroy[key];
  array.removeObject(fn);
  fn();
}

export const registerDestroy = (owner, fn) => {
  if(!owner) {
    return;
  }
  if(!owner.willDestroy) {
    return;
  }
  let array = owner.willDestroy[key];
  if(!array) {
    array = A();
    let willDestroy = owner.willDestroy;
    owner.willDestroy = function() {
      for(let i = 0; i < array.length; i++) {
        let fn = array[i];
        fn();
      }
      willDestroy.apply(owner, arguments);
    }
    owner.willDestroy[key] = array;
  }
  array.push(fn);
  return fn;
};
