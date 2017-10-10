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
    this._values = null;
  }

  _createModel() {
    return this.store._createFilter(this);
  }

  get documents() {
    return this.database.get('identity');
  }

  get _ownerProperties() {
    let properties = {};
    let owner = this.owner;
    let source = this.opts.owner;
    for(let key in source) {
      properties[key] = get(owner, source[key]);
    }
    return properties;
  }

  get _properties() {
    let owner = this.owner;
    if(!owner) {
      return;
    }
    let props = {};
    let source = this.opts.owner;
    for(let key in source) {
      props[key] = get(owner, source[key]);
    }
    return props;
  }

  __matches() {
    let matches = this.opts.matches;
    let owner = this.owner;
    let props = this._properties;
    return doc => !!matches.call(owner, doc, props);
  }

  _matches(doc) {
    let matches = this.__matches();
    return matches(doc);
  }

  _match(docs) {
    let matches = this.__matches();
    return docs.filter(doc => matches(doc));
  }

  _rematch() {
    let matches = this.__matches();

    let docs = this.documents;
    let remove = docs.map(doc => doc);
    let add = [];

    docs.forEach(doc => {
      if(matches(doc)) {
        add.push(doc);
        remove.removeObject(doc);
      }
    });

    this._remove(remove);
    this._push(add);
  }

  _push(docs) {
    this.values.addObjects(docs);
  }

  _remove(docs) {
    this.values.removeObjects(docs);
  }

  //

  _ownerValueForKeyDidChange() {
    this._rematch();
  }

  _withOwnerObserving(cb) {
    let owner = this.owner;
    if(!owner) {
      return;
    }
    let keys = Object.values(this.opts.owner);
    if(keys.length === 0) {
      return;
    }
    keys.forEach(key => cb(owner, key));
  }

  _startObservingOwner() {
    this._withOwnerObserving((owner, key) => {
      owner.addObserver(key, this, this._ownerValueForKeyDidChange);
    });
  }

  _stopObservingOwner() {
    this._withOwnerObserving((owner, key) => {
      owner.removeObserver(key, this, this._ownerValueForKeyDidChange);
    });
  }

  //

  _documentValueForKeyDidChange(doc) {
    if(this._matches(doc)) {
      this._push([ doc ]);
    } else {
      this._remove([ doc ]);
    }
  }

  _withDocumentObserving(docs, cb) {
    if(docs.length === 0) {
      return;
    }
    let keys = Object.values(this.opts.document);
    if(keys.length === 0) {
      return;
    }
    keys.forEach(key => docs.forEach(doc => cb(doc, key)));
  }

  _startObservingDocuments(docs) {
    this._withDocumentObserving(docs, (doc, key) => {
      doc.addObserver(key, this, this._documentValueForKeyDidChange);
    });
  }

  _stopObservingDocuments(docs) {
    this._withDocumentObserving(docs, (doc, key) => {
      doc.removeObserver(key, this, this._documentValueForKeyDidChange);
    });
  }

  _documentsWillChange(documents, removing) {
    this._stopObservingDocuments(removing);
    this._remove(removing);
  }

  _documentsDidChange(documents, removeCount, adding) {
    this._startObservingDocuments(adding);
    let matched = this._match(adding);
    this._push(matched);
  }

  get _documentsObserverOptions() {
    return {
      willChange: this._documentsWillChange,
      didChange: this._documentsDidChange
    };
  }

  _startObservingDocumentArray() {
    let documents = this.documents;
    documents.addEnumerableObserver(this, this._documentsObserverOptions);
    this._startObservingDocuments(documents);
  }

  _stopObservingDocumentArray() {
    let documents = this.documents;
    documents.removeEnumerableObserver(this, this._documentsObserverOptions);
    this._stopObservingDocuments(documents);
  }

  //

  _startObserving() {
    this._startObservingOwner();
    this._startObservingDocumentArray();
  }

  _stopObserving() {
    this._stopObservingOwner();
    this._stopObservingDocumentArray();
  }

  get values() {
    let values = this._values;
    if(!values) {
      values = A();
      this._values = values;
      this._startObserving();
      this._rematch();
    }
    return values;
  }

  //

  _didDestroyModel() {
    super._didDestroyModel();
    this._stopObserving();
  }

  destroy() {
    this._stopObserving();
    let model = this.model();
    if(model) {
      model.destroy();
    }
  }

}
