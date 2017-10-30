import createState from './-create-state';

const {
  keys,
  State
} = createState({
  defaults: {
    isNew: false,
    isLoading: false,
    isLoaded: false,
    isDirty: false,
    isSaving: false,
    isDeleted: false,
    isError: false,
    error: null
  },
  extend: State => class DocumentState extends State {

    onDirty(changed) {
      this.set({
        isDirty: true
      }, changed);
    }

    onLoading(changed) {
      this.set({
        isLoading: true,
        isError: false,
        error: null
      }, changed);
    }

    onLoaded(changed) {
      this.set({
        isNew: false,
        isLoading: false,
        isLoaded: true,
        isDirty: false,
        isSaving: false,
        isDeleted: false,
        isError: false,
        error: null
      }, changed);
    }

    onSaving(changed) {
      this.set({
        isSaving: true,
        isError: false,
        error: null
      }, changed);
    }

    onSaved(changed) {
      this.set({
        isNew: false,
        isLoading: false,
        isLoaded: true,
        isDirty: false,
        isSaving: false,
        isDeleted: false,
        isError: false,
        error: null
      }, changed);
    }

    onDeleting(changed) {
      this.onSaving(changed);
    }

    onDeleted(changed) {
      this.set({
        isNew: false,
        isLoading: false,
        isLoaded: true,
        isDirty: false,
        isSaving: false,
        isDeleted: true,
        isError: false,
        error: null
      }, changed);
    }

    onError(error, changed) {
      this.set({
        isLoading: false,
        isSaving: false,
        isError: true,
        error
      }, changed);
    }

  }
});

export {
  keys
};

export default State;
