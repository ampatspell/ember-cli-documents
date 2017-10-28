import createState from './-create-state';
import { stateMixin, computed as computed_, defaults } from './-query-loader-state';

const computed = [ ...computed_, 'isMore' ];

const extend = State => class PaginatedState extends stateMixin(State) {

  get isMore() {
    return this._loader._isMore;
  }

  onReload(changed) {
    this.set({
      isLoading: false,
      isLoaded: false,
      isError: false,
      error: null
    }, changed);
  }

}

const { keys, State } = createState({ defaults, computed, extend });

export {
  keys
};

export default State;
