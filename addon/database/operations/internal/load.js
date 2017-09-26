import Ember from 'ember';
import Operation from './operation';

const {
  RSVP: { resolve },
  merge
} = Ember;

export default class InternalDocumentSaveOperation extends Operation {

  willLoad() {
    this.withPropertyChanges(changed => this.state.onLoading(changed));
  }

  load() {
    let id = this.internal.getId();
    return this.docs.load(id);
  }

  didLoad(json) {
    this.withPropertyChanges(changed => {
      this.internal.deserialize(json, 'document', changed);
      this.state.onLoaded(changed);
    });

    this.resolve();
  }

  loadDidFail(err) {
    this.withPropertyChanges(changed => {
      this.state.onError(err, changed);
    });

    this.reject(err);
  }

  invoke() {
    let opts = merge({ force: false }, this.opts);

    if(this.state.isLoaded && !opts.force) {
      return this.resolve();
    }

    if(this.state.isNew) {
      return this.resolve();
    }

    return resolve()
      .then(() => this.willLoad())
      .then(() => this.load())
      .then(json => this.didLoad(json), err => this.loadDidFail(err));
  }

}
