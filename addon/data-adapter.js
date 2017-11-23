import DataAdapter from '@ember/debug/data-adapter';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import { typeOf } from '@ember/utils';
import Model from './document/model';
import Models from './document/models';

// https://github.com/emberjs/data/blob/master/addon/-private/system/debug/debug-adapter.js

const __documents_data_adapter_name = '__documents_data_adapter_name';

export default DataAdapter.extend({

  stores: service(),

  _nameToClass(name) {
    let result = this._super(...arguments);
    if(typeOf(result) === 'class') {
      set(result, __documents_data_adapter_name, name);
    }
    return result;
  },

  detect(typeClass) {
    if(typeClass === Model) {
      return;
    }
    if(typeClass === Models) {
      return;
    }
    if(!Model.detect(typeClass) && !Models.detect(typeClass)) {
      return;
    }
    let name = get(typeClass, __documents_data_adapter_name);
    if(name) {
      let components = name.split('/');
      if(components[components.length - 1].indexOf('-') === 0) {
        return;
      }
    }
    return true;
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
