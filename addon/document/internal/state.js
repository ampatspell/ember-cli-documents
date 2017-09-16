export default class State {

  constructor() {
    this.values = {
      isNew: true,
      isLoading: false,
      isLoaded: false,
      isDirty: false,
      isSaving: false,
      isDeleted: false,
      isError: false,
      error: null
    };
  }

  get(key) {
    return this.values[key];
  }

  set(props, changed) {
    let state = this.values;
    let any = false;
    for(let key in props) {
      let value = props[key];
      if(state[key] !== value) {
        state[key] = value;
        changed(key);
        any = true;
      }
    }
    if(any) {
      changed('state');
    }
  }

}
