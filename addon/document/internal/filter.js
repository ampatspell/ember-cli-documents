import Ember from 'ember';
import Base from './base';
import ModelMixin from './-model-mixin';

const {
  get,
  A
} = Ember;

export default class FilterInternal extends ModelMixin(Base) {

  /*
    opts: {
      owner: { id: 'id' },
      document: { id: 'id' },
      matches(doc, props) {
        return doc.get('id') === props.id;
      }
    }
  */
  constructor(store, database, owner, opts) {
    super();
    this.store = store;
    this.database = database;
    this.owner = owner;
    this.opts = opts;
  }

  _createModel() {
    return this.store._createFilter(this);
  }

  get documents() {
    return this.database.get('identity');
  }

  get properties() {
    let properties = {};
    let owner = this.owner;
    let source = this.opts.owner;
    for(let key in source) {
      properties[key] = get(owner, source[key]);
    }
    return properties;
  }

  recompute() {
    let documents = this.documents;
    let owner = this.owner;
    let properties = this.properties;
    let matches = this.opts.matches;
    return A(documents.filter(doc => {
      return matches.call(owner, doc, properties);
    }));
  }

}
