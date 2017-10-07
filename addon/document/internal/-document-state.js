import createState from './-create-state';

const {
  keys,
  State
} = createState({
  isNew: false,
  isLoading: false,
  isLoaded: false,
  isDirty: false,
  isSaving: false,
  isDeleted: false,
  isError: false,
  error: null
});

export {
  keys
};

export default State;
