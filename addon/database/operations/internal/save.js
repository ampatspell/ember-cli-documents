import Ember from 'ember';
import Operation from './operation';

const {
  RSVP: { resolve },
} = Ember;

export default class InternalDocumentSaveOperation extends Operation {

  willSave() {
    this.withPropertyChanges(changed => this.state.onSaving(changed));
    return this.internal.serialize('document');
  }

  save(doc) {
    return this.docs.save(doc);
  }

  didSave(json) {
    this.withPropertyChanges(changed => {
      this.internal.deserializeSaved(json, changed);
      this.state.onSaved(changed);
    });

    this.resolve();
  }

  saveDidFail(err) {
    this.withPropertyChanges(changed => {
      this.state.onError(err, changed);
    });

    this.reject(err);
  }

  invoke() {
    return resolve()
      .then(() => this.willSave())
      .then(doc => this.save(doc))
      .then(json => this.didSave(json), err => this.saveDidFail(err));
  }

}
