import EmberObject from '@ember/object';
import ModelMixin from './-model-mixin';
import { property, call } from './-properties';

const store = property('store');
const database = property('database');

const Model = EmberObject.extend(ModelMixin, {

  store: store(),
  database: database(),

  model: call('createModel')

});

Model.reopenClass({

  _debug: {
    columns: [
      {
        name: 'store',
        desc: 'Store'
      },
      {
        name: 'database',
        desc: 'Database'
      }
    ]
  }

});

export default Model;
