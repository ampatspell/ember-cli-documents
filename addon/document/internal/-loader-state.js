import createState from './-create-state';

const {
  keys,
  State
} = createState({
  isLoading: false,
  isLoaded: false,
  isError: false,
  error: null
});

export {
  keys
};

export default State;
