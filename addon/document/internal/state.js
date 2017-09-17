import Ember from 'ember';

const {
  assign
} = Ember;

export default class State {

  constructor() {
    assign(this, {
      isNew: true,
      isLoading: false,
      isLoaded: false,
      isDirty: false,
      isSaving: false,
      isDeleted: false,
      isError: false,
      error: null
    });
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

}
