import { Model } from 'documents';
import { readOnly } from '@ember/object/computed';

const session = name => readOnly(`session.${name}`);

export default Model.extend({

  name: null,
  password: null,

  session: readOnly('store.session'),

  isError:  session('isError'),
  error:    session('error'),
  isSaving: session('isSaving'),

  async commit() {
    let session = this.get('session');
    let { name, password } = this.getProperties('name', 'password')
    session.setProperties({ name, password });
    await session.save();
  }

});
