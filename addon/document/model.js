import Ember from 'ember';
import ModelMixin from './-model-mixin';
import { property, call } from './-properties';

const store = property('store');

const Model = Ember.Object.extend(ModelMixin, {

  store: store(),
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
