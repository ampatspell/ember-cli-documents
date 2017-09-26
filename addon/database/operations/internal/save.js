import Ember from 'ember';
import Operation from './operation';
import { later } from 'documents/util/run';

const {
  RSVP: { resolve },
} = Ember;

export default class InternalDocumentSaveOperation extends Operation {

  willSave() {
    this.withPropertyChanges(changed => this.state.onSaving(changed));
    return this.internal.serialize('document');
  }

  save(doc) {
    return later(50).then(() => ({ id: doc._id, rev: '1-asd' }));
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
    let doc;
    let json;

    return resolve()
      .then(() => this.willSave()).then(arg => doc = arg)
      .then(() => this.save(doc)).then(arg => json = arg)
      .then(() => this.didSave(json), err => this.saveDidFail(err));
  }

}
