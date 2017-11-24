import Route from '@ember/routing/route';

export default Route.extend({

  async model(params) {
    let id = params.doc_id;
    let model = this.get('state.database').model('document', { id });
    await model.load();
    return model;
  }

});
