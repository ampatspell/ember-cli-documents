import Ember from 'ember';
import Model from './document/model';
import Models from './document/models';

const {
  inject: { service },
  get
} = Ember;

// https://github.com/emberjs/data/blob/master/addon/-private/system/debug/debug-adapter.js

export default Ember.DataAdapter.extend({

  stores: service(),

  detect(typeClass) {
    if(typeClass === Model) {
      return;
    }
    if(typeClass === Models) {
      return;
    }
    if(Model.detect(typeClass)) {
      return true;
    }
    if(Models.detect(typeClass)) {
      return true;
    }
  },

  columnsForType(typeClass) {
    let debug = get(typeClass, '_debug');
    let columns = debug && debug.columns || [];
    return columns;
  },

  getRecords(modelClass) {
    return this.get('stores.modelsIdentity').modelsByClass(modelClass);
  },

  getRecordColumnValues(model) {
    let columns = this.columnsForType(model.constructor);
    let values = {};
    columns.forEach(col => {
      values[col.name] = model.get(col.name);
    });
    return values;
  }

});
