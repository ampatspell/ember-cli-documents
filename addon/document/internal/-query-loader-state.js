import createState from './-create-state';

const defaults = {
  isLoading: false,
  isLoaded: false,
  isError: false,
  error: null
};

const computed = [ 'isLoadable' ];

const stateMixin = Class => class QueryLoaderStateMixin extends Class {

  constructor(loader) {
    super();
    this._loader = loader;
  }

  get isLoadable() {
    return this._loader._isLoadable;
  }

  onLoadScheduled(changed) {
    this.set({ isLoading: true, isError: false, error: null }, changed);
  }

}

const extend = State => class QueryLoaderState extends stateMixin(State) {}

const { keys, State } = createState({ defaults, computed, extend });

export {
  defaults,
  computed,
  stateMixin,
  keys
};

export default State;
