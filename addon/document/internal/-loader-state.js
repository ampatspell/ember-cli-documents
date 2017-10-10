import createState from './-create-state';

const {
  keys,
  State
} = createState({
  isLoading: false,
  isLoaded: false,
  isError: false,
  error: null
}, {
  onLoadScheduled(changed) {
    this.set({ isLoading: true }, changed);
  }
});

export {
  keys
};

export default State;
