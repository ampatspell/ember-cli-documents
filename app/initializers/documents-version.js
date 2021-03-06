import Ember from 'ember';
import environment from '../config/environment';

const {
  name,
  version
} = environment.documents;

let registered = false;

export default {
  name: 'documents:version',
  after: 'documents:internal',
  initialize() {
    if(registered) {
      return;
    }
    Ember.libraries.register(name, version);
    registered = true;
  }
};
