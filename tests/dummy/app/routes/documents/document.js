import Ember from 'ember';

export default Ember.Route.extend({

  async model(params) {
    let id = params.doc_id;
    let model = this.get('state.database').model('document', { id });
    await model.load();
    return model;
  }

});
