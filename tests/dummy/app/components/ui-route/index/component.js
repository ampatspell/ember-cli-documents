import Component from '@ember/component';
import layout from './template';
import { documents } from 'dummy/models/documents';

export default Component.extend({
  classNameBindings: [ ':ui-route', ':index' ],
  layout,

  documents: documents()

});
