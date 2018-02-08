import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';
import { readOnly, equal } from '@ember/object/computed';
import { store } from 'documents';

const type = value => equal('_type', value).readOnly();

export default Component.extend({
  classNameBindings: [ ':ui-application' ],
  layout,

  store: store('remote'),
  session: readOnly('store.session'),

  type: null,

  _type: computed('type', function() {
    return this.get('type') || 'default';
  }).readOnly(),

  isDefault: type('default'),
  isEmpty: type('empty'),

});
