import Service from '@ember/service';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { hash } from 'rsvp';

const singleton = name => computed(function() {
  return getOwner(this).factoryFor(`model:state/${name}`).create();
}).readOnly();

export default Service.extend({

  changes: singleton('changes'),
  setup:   singleton('setup'),

  async restore() {
    let { changes, setup } = this.getProperties('changes', 'setup');
    return await hash({
      changes: changes.start(),
      setup:   setup.validate()
    });
  }

});
