import createState from './-create-state';

const {
  keys,
  State
} = createState({
  defaults: {
    isLoadable: true,
    isLoading: false,
    isLoaded: false,
    isError: false,
    error: null
  },
  proto: {
    onLoadable(isLoadable, changed) {
      this.set({ isLoadable }, changed);
    },
    onReset(changed) {
      this.set({ isLoadable: true, isLoaded: false, isError: false, error: null }, changed);
    },
    onLoadScheduled(changed) {
      this.set({ isLoading: true }, changed);
    }
  }
});

export {
  keys
};

export default State;
