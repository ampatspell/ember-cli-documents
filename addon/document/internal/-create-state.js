import Ember from 'ember';

const {
  assign,
  A
} = Ember;

export default defaults => {
  let keys = A(Object.keys(defaults));
  let create = hash => {
    A(Object.keys(hash)).forEach(key => {
      if(!keys.includes(key)) {
        delete hash[key];
      }
    });
    return hash;
  };
  let states = {
    onDirty: create({
      isDirty: true
    }),
    onLoading: create({
      isLoading: true,
      isError: false,
      error: null
    }),
    onLoaded: create({
      isNew: false,
      isLoading: false,
      isLoaded: true,
      isDirty: false,
      isSaving: false,
      isDeleted: false,
      isError: false,
      error: null
    }),
    onSaving: create({
      isSaving: true,
      isError: false,
      error: null
    }),
    onSaved: create({
      isNew: false,
      isLoading: false,
      isLoaded: true,
      isDirty: false,
      isSaving: false,
      isDeleted: false,
      isError: false,
      error: null
    }),
    onDeleted: create({
      isNew: false,
      isLoading: false,
      isLoaded: true,
      isDirty: false,
      isSaving: false,
      isDeleted: true,
      isError: false,
      error: null
    }),
    onError: create({
      isLoading: false,
      isSaving: false,
      isError: true
    })
  };

  class State {

    constructor() {
      assign(this, defaults);
    }

    set(props, changed) {
      let any = false;
      for(let key in props) {
        let value = props[key];
        if(this[key] !== value) {
          this[key] = value;
          changed(key);
          any = true;
        }
      }
      if(any) {
        changed('state');
      }
    }

    get() {
      return keys.reduce((obj, key) => {
        obj[key] = this[key];
        return obj;
      }, {});
    }

    onDirty(changed) {
      this.set(states.onDirty, changed);
    }

    onLoading(changed) {
      this.set(states.onLoading, changed);
    }

    onLoaded(changed) {
      this.set(states.onLoaded, changed);
    }

    onSaving(changed) {
      this.set(states.onSaving, changed);
    }

    onSaved(changed) {
      this.set(states.onSaved, changed);
    }

    onDeleting(changed) {
      this.onSaving(changed);
    }

    onDeleted(changed) {
      this.set(states.onDeleted, changed);
    }

    onError(error, changed) {
      this.set(assign({ error }, states.onError), changed);
    }

  }

  return { keys, State };
};
