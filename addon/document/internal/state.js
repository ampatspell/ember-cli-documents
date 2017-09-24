import Ember from 'ember';

const {
  assign
} = Ember;

const defaults = {
  isNew: false,
  isLoading: false,
  isLoaded: false,
  isDirty: false,
  isSaving: false,
  isDeleted: false,
  isError: false,
  error: null
};

export const keys = Object.keys(defaults);

export default class State {

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
    this.set({ isDirty: true }, changed);
  }

  onLoaded(changed) {
    this.set({
      isNew: false,
      isLoading: false,
      isLoaded: true,
      isDirty: false,
      isSaving: false,
      isDeleted: false,
      isError: false,
      error: null
    }, changed);
  }

  onDeleted(changed) {
    this.set({
      isNew: false,
      isLoading: false,
      isLoaded: true,
      isDirty: false,
      isSaving: false,
      isDeleted: true,
      isError: false,
      error: null
    }, changed);
  }

}
