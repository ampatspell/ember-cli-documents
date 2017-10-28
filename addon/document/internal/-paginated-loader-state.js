import Ember from 'ember';
import createState from './-create-state';
import { stateMixin, computed, defaults as defaults_ } from './-query-loader-state';

const {
  merge
} = Ember;

const defaults = merge({ isMore: false }, defaults_);

const extend = State => class PaginatedState extends stateMixin(State) {

  // onLoadedPaginated(isMore, changed) {
  //   this.onLoaded(changed);
  //   this.set({ isMore }, changed);
  // }

}

const { keys, State } = createState({ defaults, computed, extend });

export {
  keys
};

export default State;
