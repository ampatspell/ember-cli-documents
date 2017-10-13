const key = '__ember_cli_documents__';

export default (owner, fn) => {
  if(!owner.willDestroy) {
    return;
  }
  let array = owner.willDestroy[key];
  if(!array) {
    array = [];
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
};
