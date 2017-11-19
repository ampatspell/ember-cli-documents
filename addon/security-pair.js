import EmberObject, { observer } from '@ember/object';
import { array } from './util/computed';

export default EmberObject.extend({

  security: null,
  key: null,

  names: array(),
  roles: array(),

  deserialize(data) {
    var names = this.get('names');
    var roles = this.get('roles');
    if(!data) {
      names.clear();
      roles.clear();
    } else {
      names.setObjects(data.names);
      roles.setObjects(data.roles);
    }
  },

  serialize() {
    return {
      names: this.get('names') || [],
      roles: this.get('roles') || []
    };
  },

  clear() {
    this.deserialize();
  },

  _observeNamesAndRoles: observer('names.[]', 'roles.[]', function() {
    this.get('security').onDirty();
  })

});
