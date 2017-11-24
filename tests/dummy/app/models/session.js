import { Model, model } from 'documents';
import { readOnly } from '@ember/object/computed';

export const changeset = () => model({
  create() {
    return {
      type: 'session/changeset'
    };
  }
});

export default Model.extend({

  session: readOnly('store.session'),

  async restore() {
    await this.get('session').restore();
    return { ok: true };
  }

});
