import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let db = this.get('db');
    let id = 'message:first';
    return db.find(id).catch(err => {
      if(err.error !== 'not_found') {
        return reject(err);
      }
      return db.doc({
        id,
        type: 'message',
        content: "To whom it may concern: It is springtime. It is late afternoon."
      }).save();
    });
  }
});
