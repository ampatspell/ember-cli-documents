import createState from './-create-state';

const defaults = {
  isLoading: false,
  isLoaded: false,
  isError: false,
  error: null
};

const computed = [ 'isLoadable' ];

const extend = State => class QueryLoaderState extends State {

  constructor(loader) {
    super();
    this._loader = loader;
  }

  get isLoadable() {
    return this._loader._isLoadable;
  }

}

const {
  keys,
  State
} = createState({ defaults, computed, extend });

export {
  keys
};

export default State;

// onLoadable(isLoadable, changed) {
//   this.set({ isLoadable }, changed);
// },
// onReset(changed) {
//   this.set({ isLoadable: true, isLoaded: false, isError: false, error: null }, changed);
// },
// onLoadScheduled(changed) {
//   this.set({ isLoading: true }, changed);
// }
