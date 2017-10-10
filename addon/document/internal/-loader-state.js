import createState from './-create-state';

const {
  keys,
  State
} = createState({
  defaults: {
    isLoading: false,
    isLoaded: false,
    isError: false,
    error: null
  },
  proto: {
    onLoadScheduled(changed) {
      this.set({ isLoading: true }, changed);
    }
  }
});

export {
  keys
};

export default State;
