import { Model } from 'documents';
import { readOnly, alias } from '@ember/object/computed';

const session = name => alias(`session.${name}`);

export default Model.extend({

  session: readOnly('store.session'),

  isAuthenticated: session('isAuthenticated'),
  isSaving:        session('isSaving'),
  isError:         session('isError'),
  name:            session('name'),
  password:        session('password'),
  error:           session('error'),

  async restore() {
    await this.get('session').restore();
    return { ok: true };
  },

  async save() {
    await this.get('session').save();
  },

  async delete() {
    await this.get('session').delete();
  }

});
