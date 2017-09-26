import Ember from 'ember';
import BaseLoad from './base-load';

const {
  merge
} = Ember;

export default class InternalDocumentLoadOperation extends BaseLoad {

  invoke() {
    let opts = merge({ force: false }, this.opts);

    if(this.state.isLoaded && !opts.force) {
      return this.resolve();
    }

    if(this.state.isNew) {
      return this.resolve();
    }

    return this._invoke();
  }

}
