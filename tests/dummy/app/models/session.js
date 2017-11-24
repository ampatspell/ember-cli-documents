import { Model } from 'documents';
import { readOnly } from '@ember/object/computed';

export default Model.extend({

  session: readOnly('store.session'),

  async restore() {
    await this.get('session').restore();
    return { ok: true };
  }

});
