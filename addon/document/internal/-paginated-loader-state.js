import createState from './-create-state';

const {
  keys,
  State
} = createState({
  defaults: {
    isLoading: false,
    isLoaded: false,
    isMore: false,
    isError: false,
    error: null
  },
  extend: State => class PaginatedState extends State {

    onReset(changed) {
      this.set({ isLoaded: false, isMore: false, isError: false, error: null }, changed);
    }

    onLoadScheduled(changed) {
      this.set({ isLoading: true }, changed);
    }

    onLoadedPaginated(isMore, changed) {
      this.onLoaded(changed);
      this.set({ isMore }, changed);
    }

  }
});

export {
  keys
};

export default State;
